---
trigger: always_on
---

Desarrolla una aplicación web de calendario basada en el método sintotérmico para el seguimiento del ciclo menstrual y la fertilidad.

🔐 1. Sistema de autenticación
Implementar:
Registro de usuarios
Inicio de sesión
Gestión de sesión (login persistente)
Base de datos: MariaDB
Crear toda la lógica backend necesaria (usuarios, autenticación, validación)
🗄️ 2. Base de datos (npx neonctl@latest init)

Diseñar las tablas necesarias, por ejemplo:

Usuarios
Registros diarios

Cada registro diario debe incluir:

Fecha
Temperatura basal
Tipo de flujo
Día del ciclo
Relaciones sexuales:
Sí / No
Uso de preservativo (Sí / No)
Comentarios
📅 3. Página principal: Calendario

Crear una vista de calendario interactiva con dos modos:

Vista mensual (calendario clásico)
Vista de ciclo (bloque de 30 días enfocado en el periodo)
📌 Funcionalidad clave:
Cada día es seleccionable
Se lleva un registro diario completo
🧩 Estructura visual de cada día:
Parte superior: fecha del mes
Centro: temperatura basal
Parte inferior: estado del ciclo (con color)
🎨 4. Estados del ciclo y colores

Asignar estados según el método sintotérmico:

Menstruación → rojo
Spotting → rosa pálido
Preovulación (sequedad) → gris
Moco EL (estrogénico “locked in”) → celeste
Moco ES (estrogénico “string”) → azul
Peak Day (último día de moco ES) → indicador especial "P"
Post Peak:
3 días → violeta
Luego:
Sequedad → gris
Después reinicia el ciclo
🧾 5. Modal de registro diario

Al hacer clic en un día:

Abrir un modal con formulario para:
Temperatura
Tipo de flujo
Relaciones sexuales:
Sí / No
Con preservativo / sin preservativo
Comentarios
📊 6. Página secundaria: Gráfico

Crear una segunda página con:

Gráfico lineal de temperaturas registradas
Cada punto del gráfico debe:
Representar un día
Tener el color correspondiente al estado del ciclo (igual que el calendario)
🧱 7. Extras recomendados
Validación de datos (ej: temperatura en rangos válidos)
Responsive design (mobile first)
Vista previa tipo “mock” del calendario mientras se construye
Filtros o navegación entre ciclos