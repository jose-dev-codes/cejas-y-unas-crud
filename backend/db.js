// Carga las variables de entorno desde el archivo .env
require("dotenv").config();
const { Pool } = require("pg");

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_POR
});

// Exporta el pool de conexiones para ser usado en los demás módulos
module.exports = pool;