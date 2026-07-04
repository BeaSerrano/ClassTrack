const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Verifica que el token sea válido y adjunta el usuario a la petición
const protegerRuta = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = await Usuario.findById(decoded.id);

      if (!req.usuario) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Token no válido o expirado' });
    }
  }

  return res.status(401).json({ message: 'No autorizado, falta el token' });
};

// Restringe el acceso a ciertos roles, ej: autorizarRoles('docente')
const autorizarRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        message: `El rol '${req.usuario.rol}' no tiene permiso para esta acción`,
      });
    }
    next();
  };
};

module.exports = { protegerRuta, autorizarRoles };
