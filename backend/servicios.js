// Conexión a la base de datos PostgreSQL
const pool = require("./db");

// Obtiene todos los servicios cuyo estado sea "activo" (para mostrar en el dropdown del front)
async function verServicios() {
    const result = await pool.query(
        "SELECT * FROM servicios WHERE estado = 'activo'");
    return result.rows;
}

// Exporta la función para ser usada en index.js
module.exports = { verServicios };