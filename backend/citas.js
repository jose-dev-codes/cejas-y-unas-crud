// Conexión a la base de datos PostgreSQL
const pool = require("./db");

// Crea una nueva cita en la base de datos con estado "pendiente"
async function agendarCita(id_usuario, id_servicio, fecha, hora, especialista) {
    const result = await pool.query(
        "INSERT INTO citas (id_usuario, id_servicio, fecha, hora, especialista, estado) VALUES($1, $2, $3, $4, $5, 'pendiente') RETURNING *",
        [id_usuario, id_servicio, fecha, hora, especialista]
    );
    return result.rows[0];
}

// Obtiene todas las citas registradas
async function verCitas() {
    const result = await pool.query("SELECT * FROM citas");
    return result.rows;
}

// Actualiza los datos de una cita existente según su id
async function actualizarCita(id, nuevosDatos) {
    const { fecha, hora, especialista, id_usuario, id_servicio } = nuevosDatos;
    const result = await pool.query(
        "UPDATE citas SET fecha = $1, hora = $2, especialista = $3, id_usuario = $4, id_servicio = $5 WHERE id_cita = $6 RETURNING *",
        [fecha, hora, especialista, id_usuario, id_servicio, id]
    );
    return result.rows[0] || null;
}

// Elimina una cita según su id y devuelve los datos eliminados
async function cancelarCita(id) {
    const result = await pool.query(
        "DELETE FROM citas WHERE id_cita = $1 RETURNING *",
        [id]
    );
    return result.rows[0] || null;
}

// Exporta las funciones del módulo de citas para ser usadas en index.js
module.exports = { agendarCita, verCitas, actualizarCita, cancelarCita };