const Tarea = require('../models/Tarea');
const Curso = require('../models/Curso');

// POST /api/tareas  (solo docente, dueño del curso)
const crearTarea = async (req, res) => {
  const { curso, titulo, descripcion, fechaLimite } = req.body;

  if (!curso || !titulo || !fechaLimite) {
    return res.status(400).json({ message: 'Curso, título y fecha límite son obligatorios' });
  }

  const cursoEncontrado = await Curso.findById(curso);
  if (!cursoEncontrado) {
    return res.status(404).json({ message: 'Curso no encontrado' });
  }

  if (cursoEncontrado.docente.toString() !== req.usuario._id.toString()) {
    return res.status(403).json({ message: 'No eres el docente de este curso' });
  }

  const tarea = await Tarea.create({ curso, titulo, descripcion, fechaLimite });

  res.status(201).json(tarea);
};

// GET /api/tareas/curso/:cursoId
const obtenerTareasPorCurso = async (req, res) => {
  const curso = await Curso.findById(req.params.cursoId);
  if (!curso) {
    return res.status(404).json({ message: 'Curso no encontrado' });
  }

  const esDocente = curso.docente.toString() === req.usuario._id.toString();
  const esAlumno = curso.alumnos.some((id) => id.toString() === req.usuario._id.toString());

  if (!esDocente && !esAlumno) {
    return res.status(403).json({ message: 'No perteneces a este curso' });
  }

  const tareas = await Tarea.find({ curso: req.params.cursoId }).sort({ fechaLimite: 1 });
  res.json(tareas);
};

module.exports = { crearTarea, obtenerTareasPorCurso };
