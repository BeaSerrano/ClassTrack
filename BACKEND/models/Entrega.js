const mongoose = require('mongoose');

const entregaSchema = new mongoose.Schema(
  {
    tarea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tarea',
      required: true,
    },
    alumno: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    contenido: {
      type: String,
      required: [true, 'El contenido de la entrega es obligatorio'],
    },
    estado: {
      type: String,
      enum: ['pendiente', 'en_revision', 'aprobado', 'a_revisar'],
      default: 'en_revision',
    },
    comentarios: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Un alumno solo puede tener una entrega por tarea
entregaSchema.index({ tarea: 1, alumno: 1 }, { unique: true });

module.exports = mongoose.model('Entrega', entregaSchema);
