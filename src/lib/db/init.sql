-- ============================================================
-- Método Sintotérmico - Database Setup Script (PostgreSQL/Neon)
-- ============================================================

-- 1. EXTENSIONS (Opcional, para UUIDs si fuera necesario)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TYPES & ENUMS
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'flow_type_enum') THEN
        CREATE TYPE flow_type_enum AS ENUM (
            'menstruation',
            'spotting',
            'dry',
            'mucus_el',
            'mucus_es',
            'peak_day'
        );
    END IF;
END $$;

-- 3. TABLES

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Daily Records Table
CREATE TABLE IF NOT EXISTS daily_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    basal_temp DECIMAL(4,2) DEFAULT NULL,
    flow_type flow_type_enum DEFAULT NULL,
    cycle_day INTEGER DEFAULT NULL,
    had_sex BOOLEAN DEFAULT FALSE,
    used_condom BOOLEAN DEFAULT FALSE,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date) -- Evita registros duplicados para el mismo día y usuario
);

-- 4. INDEXES (Para optimizar consultas frecuentes)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_records_user_date ON daily_records(user_id, date);
CREATE INDEX IF NOT EXISTS idx_records_flow_type ON daily_records(flow_type);

-- 5. TRIGGERS (Para actualizar updated_at automáticamente)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_update_users_modtime ON users;
CREATE TRIGGER trg_update_users_modtime 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS trg_update_records_modtime ON daily_records;
CREATE TRIGGER trg_update_records_modtime 
    BEFORE UPDATE ON daily_records 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

-- 6. SECURITY (RLS - Row Level Security)
-- Nota: En Neon/PostgreSQL estándar, RLS se activa por tabla.
-- Para que sea efectivo, el usuario de la DB debería ser diferente al owner, 
-- o usar 'current_setting' para pasar el ID del usuario desde Next.js.

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_records ENABLE ROW LEVEL SECURITY;

-- Políticas para users (Cada uno ve solo su perfil)
-- Aquí asumimos que definiremos 'app.current_user_id' en la conexión si queremos forzarlo a nivel DB
DROP POLICY IF EXISTS user_self_view ON users;
CREATE POLICY user_self_view ON users 
    FOR ALL 
    USING (id::text = current_setting('app.current_user_id', true));

-- Políticas para daily_records (Cada uno ve solo sus registros)
DROP POLICY IF EXISTS user_records_policy ON daily_records;
CREATE POLICY user_records_policy ON daily_records 
    FOR ALL 
    USING (user_id::text = current_setting('app.current_user_id', true));

-- 7. VISTAS ÚTILES (Opcional)
-- Vista para ver estadísticas rápidas del ciclo por usuario
CREATE OR REPLACE VIEW view_user_stats AS
SELECT 
    user_id,
    COUNT(*) as total_records,
    MAX(date) as last_record_date,
    AVG(basal_temp) FILTER (WHERE basal_temp IS NOT NULL) as avg_temp
FROM daily_records
GROUP BY user_id;
