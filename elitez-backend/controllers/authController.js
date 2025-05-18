const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const registerUser = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  console.log('Datos recibidos en el backend:', { username, email, password, confirmPassword });

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' });
  }

  try {
    const [existingUser] = await db.execute(
      'SELECT * FROM usuarios WHERE email = ? OR username = ?',
      [email, username]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'El usuario o el correo ya están registrados' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute('INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)', [
      username,
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.execute('SELECT id, username, email, gym_id FROM usuarios WHERE id = ?', [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log('Datos recibidos en el backend:', { username, password });

  if (!username || !password) {
    return res.status(400).json({ error: 'El nombre de usuario y la contraseña son obligatorios' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      selectedGymId: user.gym_id || null,
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

const Nomusuario = async (req, res) => {
  const userId = req.user.id;
  console.log('Usuario ID recibido del token:', userId);
  try {
    const [rows] = await db.execute(
      'SELECT id, username, gym_id FROM usuarios WHERE id = ?',
      [userId]
    );
    console.log('Resultado de la consulta:', rows);

    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    res.status(500).json({ message: 'Error al obtener el perfil del usuario' });
  }
};

const getGyms = async (req, res) => {
  try {
    console.log('Recibiendo solicitud para obtener gimnasios');
    const [gyms] = await db.execute('SELECT * FROM gimnasios');
    console.log('Gimnasios obtenidos:', gyms);
    res.status(200).json(gyms);
  } catch (error) {
    console.error('Error al obtener gimnasios:', error);
    res.status(500).json({ message: 'Error al obtener gimnasios' });
  }
};

const selectGym = async (req, res) => {
  const userId = req.user.id;
  const { gymId } = req.body;

  if (!gymId) {
    return res.status(400).json({ message: "El ID del gimnasio es requerido" });
  }

  try {
    const [result] = await db.execute('UPDATE usuarios SET gym_id = ? WHERE id = ?', [gymId, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado o sin cambios" });
    }

    res.status(200).json({ message: "Gimnasio seleccionado correctamente", gymId });
  } catch (error) {
    console.error("Error al seleccionar gimnasio:", error);
    res.status(500).json({ message: "Error al seleccionar gimnasio" });
  }
};

const getMartialArts = async (req, res) => {
  const { gymId } = req.params;

  try {
    const [martialArts] = await db.execute(`
      SELECT am.* 
      FROM gym_disciplines gd
      JOIN artes_marciales am ON gd.martial_art_id = am.id
      WHERE gd.gym_id = ?
    `, [gymId]);
    res.status(200).json(martialArts);
  } catch (error) {
    console.error('Error al obtener artes marciales:', error);
    res.status(500).json({ message: 'Error al obtener artes marciales' });
  }
};

const selectMartialArt = async (req, res) => {
  const userId = req.user.id;
  const { martialArtId } = req.body;

  try {
    await db.execute('UPDATE usuarios SET martial_art_id = ? WHERE id = ?', [martialArtId, userId]);
    res.status(200).json({ message: 'Arte marcial seleccionado correctamente' });
  } catch (error) {
    console.error('Error al seleccionar arte marcial:', error);
    res.status(500).json({ message: 'Error al seleccionar arte marcial' });
  }
};

const deselectGym = async (req, res) => {
  const userId = req.user.id;

  try {
    await db.execute('UPDATE usuarios SET gym_id = NULL WHERE id = ?', [userId]);
    res.status(200).json({ message: 'Gimnasio deseleccionado correctamente' });
  } catch (error) {
    console.error('Error al deseleccionar gimnasio:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
  
};
const getCuotasByGym = async (req, res) => {
  const userId = req.user.id;

  try {
    const [userRows] = await db.execute('SELECT gym_id FROM usuarios WHERE id = ?', [userId]);
    if (userRows.length === 0 || !userRows[0].gym_id) {
      return res.status(400).json({ message: 'Usuario sin gimnasio asociado' });
    }

    const gymId = userRows[0].gym_id;
    const [cuotas] = await db.execute('SELECT * FROM cuotas WHERE gym_id = ?', [gymId]);
    res.json(cuotas);
  } catch (err) {
    console.error('Error al obtener cuotas:', err);
    res.status(500).json({ message: 'Error al obtener cuotas' });
  }
};
const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: 'Username y Email son requeridos' });
  }

  try {
    await db.execute(
      'UPDATE usuarios SET username = ?, email = ? WHERE id = ?',
      [username, email, userId]
    );

    res.status(200).json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};
const eliminarCuenta = async (req, res) => {
  const userId = req.user.id;

  try {
    await db.execute('DELETE FROM usuarios WHERE id = ?', [userId]);
    res.status(200).json({ message: 'Cuenta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la cuenta:', error);
    res.status(500).json({ message: 'Error al eliminar la cuenta' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  Nomusuario,
  getGyms,
  selectGym,
  getMartialArts,
  selectMartialArt,
  deselectGym,
  getProfile,
  getCuotasByGym,
  updateProfile,
  eliminarCuenta
};