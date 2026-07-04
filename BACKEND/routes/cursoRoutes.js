const express = require('express');
const {
  crearCurso,
  obtenerCursos,
  obtenerCursoPorId,
  añadirAlumno,
} = require('../controllers/cursoController');
const { protegerRuta, autorizarRoles } = require('../middleware/auth');

const router = express.Router();

router.use(protegerRuta);

router.post('/', autorizarRoles('docente'), crearCurso);
router.get('/', obtenerCursos);
router.get('/:id', obtenerCursoPorId);
router.put('/:id/alumnos', autorizarRoles('docente'), añadirAlumno);

module.exports = router;
