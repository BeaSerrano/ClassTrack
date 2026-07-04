const express = require('express');
const { registrar, iniciarSesion, obtenerPerfil } = require('../controllers/autenticacionController');
const { protegerRuta } = require('../middleware/auth');

const router = express.Router();

router.post('/registro', registrar);
router.post('/login', iniciarSesion);
router.get('/perfil', protegerRuta, obtenerPerfil);

module.exports = router;
