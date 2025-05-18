const db = require('../config/db');

// Obtener videoclases por gimnasio
const getVideosByGym = async (req, res) => {
  const gymId = req.params.gymId;

  try {
    const [rows] = await db.execute(`
      SELECT v.titulo, v.url_video, a.name AS disciplina
      FROM videos_clases v
      JOIN artes_marciales a ON v.martial_art_id = a.id
      WHERE v.gym_id = ?
    `, [gymId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('❌ Error al obtener videos:', error);
    res.status(500).json({ message: 'Error al obtener videoclases' });
  }
};

module.exports = {
  getVideosByGym
};
