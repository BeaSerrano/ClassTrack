const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del curso es obligatorio'],
      trim: true,
    },
    docente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    alumnos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Curso', cursoSchema);
