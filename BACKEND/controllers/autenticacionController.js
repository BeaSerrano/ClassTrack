const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/autenticacion/registro
const registrar = async (req, res) => {
  const { nombre, email, contraseña, rol } = req.body;

  if (!nombre || !email || !contraseña || !rol) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  const usuarioExiste = await Usuario.findOne({ email });
  if (usuarioExiste) {
    return res.status(400).json({ message: 'Ya existe un usuario con ese email' });
  }

  const usuario = await Usuario.create({ nombre, email, contraseña, rol });

  res.status(201).json({
    _id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    token: generarToken(usuario._id),
  });
};

// POST /api/autenticacion/login
const iniciarSesion = async (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
  }

  const usuario = await Usuario.findOne({ email }).select('+contraseña');

  if (!usuario || !(await usuario.compararContraseña(contraseña))) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  res.json({
    _id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    token: generarToken(usuario._id),
  });
};

// GET /api/autenticacion/perfil
const obtenerPerfil = async (req, res) => {
  res.json(req.usuario);
};

module.exports = { registrar, iniciarSesion, obtenerPerfil };
