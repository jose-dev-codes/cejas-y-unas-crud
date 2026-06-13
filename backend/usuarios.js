// Conexión a la base de datos PostgreSQL
const pool = require("./db");

// Obtiene el id, nombres y apellidos de todos los usuarios (sin datos sensibles, para el dropdown del front)
async function verUsuarios() {
    const usuarios = await pool.query("SELECT id_usuario, nombres, apellidos FROM usuarios");
    return usuarios.rows;
}

// Exporta la función para ser usada en index.js
module.exports = { verUsuarios };