// Importaciones
const express = require("express");
const cors = require('cors');
const { agendarCita, verCitas, actualizarCita, cancelarCita } = require("./citas");
const { validarCita } = require("./validaciones");
const { verServicios } = require("./servicios");
const { verUsuarios } = require("./usuarios");

// Inicialización del servidor
const app = express();
app.use(cors());
app.use(express.json()); // Permite leer JSON en el body de las peticiones

// ===================== RUTAS DE CITAS =====================

// Obtener todas las citas
app.get("/citas", async (req, res) => {
    try {
        const citas = await verCitas();
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las citas" });
    }
});

// Agendar una nueva cita
app.post("/citas", async (req, res) => {
    try {
        // Validar los datos antes de guardar en la DB
        const errores = validarCita(req.body);
        if (errores) return res.status(400).json({ error: errores });

        const { id_usuario, id_servicio, fecha, hora, especialista } = req.body;
        const cita = await agendarCita(id_usuario, id_servicio, fecha, hora, especialista);
        res.json(cita);
    } catch (error) {
        res.status(500).json({ error: "Error al agendar cita" });
    }
});

// Actualizar una cita existente
app.put("/citas/:id", async (req, res) => {
    try {
        // :id es el identificador de la cita en la URL
        const cita = await actualizarCita(Number(req.params.id), req.body);
        if (!cita) return res.status(404).json({ mensaje: "Cita no encontrada" });
        res.json(cita);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar cita" });
    }
});

// Cancelar una cita
app.delete("/citas/:id", async (req, res) => {
    try {
        const resultado = await cancelarCita(Number(req.params.id));
        if (!resultado) return res.status(404).json({ error: "Cita no encontrada" });
        res.json({ mensaje: "Cita cancelada exitosamente." });
    } catch (error) {
        res.status(500).json({ error: "Error al cancelar cita" });
    }
});

// ===================== RUTAS DE SERVICIOS =====================

// Obtener todos los servicios activos (para poblar el dropdown en el front)
app.get("/servicios", async (req, res) => {
    try {
        const servicios = await verServicios();
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los servicios" });
    }
});


// ===================== RUTAS DE USUARIOS =====================

// Obtener todos los usuarios (para poblar el dropdown en el front)
app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await verUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
});

// Arrancar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
