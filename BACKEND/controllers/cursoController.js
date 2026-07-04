const Curso = require('../models/Curso');
const Usuario = require('../models/Usuario');

// POST /api/cursos  (solo docente)
const crearCurso = async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: 'El nombre del curso es obligatorio' });
  }

  const curso = await Curso.create({
    nombre,
    docente: req.usuario._id,
    alumnos: [],
  });

  res.status(201).json(curso);
};

// GET /api/cursos  (docente ve los suyos, alumno ve en los que está inscrito)
const obtenerCursos = async (req, res) => {
  let cursos;

  if (req.usuario.rol === 'docente') {
    cursos = await Curso.find({ docente: req.usuario._id }).populate('alumnos', 'nombre email');
  } else {
    cursos = await Curso.find({ alumnos: req.usuario._id }).populate('docente', 'nombre email');
  }

  res.json(cursos);
};

// GET /api/cursos/:id
const obtenerCursoPorId = async (req, res) => {
  const curso = await Curso.findById(req.params.id)
    .populate('docente', 'nombre email')
    .populate('alumnos', 'nombre email');

  if (!curso) {
    return res.status(404).json({ message: 'Curso no encontrado' });
  }

  res.json(curso);
};

// PUT /api/cursos/:id/alumnos  (solo docente, añade un alumno por email)
const añadirAlumno = async (req, res) => {
  const { email } = req.body;

  const curso = await Curso.findById(req.params.id);
  if (!curso) {
    return res.status(404).json({ message: 'Curso no encontrado' });
  }

  if (curso.docente.toString() !== req.usuario._id.toString()) {
    return res.status(403).json({ message: 'No eres el docente de este curso' });
  }

  const alumno = await Usuario.findOne({ email, rol: 'alumno' });
  if (!alumno) {
    return res.status(404).json({ message: 'No existe un alumno con ese email' });
  }

  if (curso.alumnos.includes(alumno._id)) {
    return res.status(400).json({ message: 'El alumno ya está en este curso' });
  }

  curso.alumnos.push(alumno._id);
  await curso.save();

  res.json(curso);
};

module.exports = { crearCurso, obtenerCursos, obtenerCursoPorId, añadirAlumno };
