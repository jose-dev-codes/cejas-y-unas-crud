// Valida los datos de una cita antes de guardarla o actualizarla en la base de datos
// Devuelve un mensaje de error si algo no es válido, o null si todo está correcto
function validarCita(datos) {
    const { id_usuario, id_servicio, fecha, hora, especialista } = datos;
    
    // Verifica que ningún campo venga vacío o sin defini
    if (!id_usuario || !id_servicio || !fecha || !hora || !especialista) {
        return "Todos los datos son obligatorios";
    }

    // Verifica que los ids sean números válidos
    if (isNaN(id_usuario) || isNaN(id_servicio)) {
        return "id_usuario e id-servicios deben ser números";
    }

    // Verifica que la fecha no sea anterior a hoy
    if (new Date(fecha) < new Date()) {
        return "La fecha no puede ser en el pasado";
    }

    return null;

}

// Exporta la función para ser usada en index.js
module.exports = { validarCita };