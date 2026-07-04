const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema(
  {
    curso: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Curso',
      required: true,
    },
    titulo: {
      type: String,
      required: [true, 'El título de la tarea es obligatorio'],
      trim: true,
    },
    descripcion: {
      type: String,
      default: '',
    },
    fechaLimite: {
      type: Date,
      required: [true, 'La fecha límite es obligatoria'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tarea', tareaSchema);
