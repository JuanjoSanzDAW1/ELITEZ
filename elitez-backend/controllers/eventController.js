const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const eliminarEvento = async (req, res) => {
    const eventoId = req.params.id;
    try {
        const [result] = await db.execute(`DELETE FROM eventos_gimnasios WHERE id = ?`, [eventoId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        res.json({ message: "Evento eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar evento:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

const getEventosPorGym = async (req, res) => {
    const gymId = req.params.gym_id;
    try {
        const [rows] = await db.execute(`
            SELECT e.id, e.titulo, e.fecha, e.hora_inicio, e.hora_fin
            FROM eventos_gimnasios e
            WHERE e.gym_id = ?
        `, [gymId]);

        console.log("✅ Eventos obtenidos:", rows);
        res.json(rows);
    } catch (error) {
        console.error("❌ Error al obtener eventos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

const agregarEvento = async (req, res) => {
    const { titulo, fecha, hora_inicio, hora_fin } = req.body;
    const usuario_id = req.user.id;
    const gym_id = req.body.gym_id || null; // 📌 Obtener el `gym_id` enviado desde el frontend

    if (!gym_id) {
        return res.status(400).json({ message: "⚠️ No se ha seleccionado un gimnasio." });
    }

    try {
        await db.execute(`
            INSERT INTO eventos_gimnasios (gym_id, usuario_id, titulo, fecha, hora_inicio, hora_fin)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [gym_id, usuario_id, titulo, fecha, hora_inicio, hora_fin]);

        res.json({ message: "✅ Evento creado con éxito" });
    } catch (error) {
        console.error("❌ Error al crear evento:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};


const getHorariosPorGym = async (req, res) => {
    const gymId = req.params.gym_id;
    try {
        const [rows] = await db.execute(`
            SELECT a.name AS disciplina, h.dia_semana, h.hora_inicio, h.hora_fin
            FROM horarios_gimnasios h
            JOIN artes_marciales a ON h.martial_art_id = a.id
            WHERE h.gym_id = ?
        `, [gymId]);

        console.log("✅ Horarios obtenidos:", rows);
        res.json(rows);
    } catch (error) {
        console.error("❌ Error al obtener horarios:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = {
    eliminarEvento,
    getEventosPorGym,
    agregarEvento,
    getHorariosPorGym,
};