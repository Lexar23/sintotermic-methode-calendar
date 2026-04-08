-- ============================================================
-- Método Sintotérmico - Database Schema (PostgreSQL)
-- ============================================================

-- Drop tables if they exist (for development/reset)
-- DROP TABLE IF EXISTS daily_records;
-- DROP TABLE IF EXISTS users;
-- DROP TYPE IF EXISTS flow_type_enum;

-- Create ENUM for flow types
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

-- ------------------------------------------------------------
-- Tabla: users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ------------------------------------------------------------
-- Tabla: daily_records
-- ------------------------------------------------------------
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
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_records_user_date ON daily_records(user_id, date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_modtime ON users;
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_records_modtime ON daily_records;
CREATE TRIGGER update_records_modtime BEFORE UPDATE ON daily_records FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
