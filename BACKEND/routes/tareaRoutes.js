const express = require('express');
const { crearTarea, obtenerTareasPorCurso } = require('../controllers/tareaController');
const { protegerRuta, autorizarRoles } = require('../middleware/auth');

const router = express.Router();

router.use(protegerRuta);

router.post('/', autorizarRoles('docente'), crearTarea);
router.get('/curso/:cursoId', obtenerTareasPorCurso);

module.exports = router;
