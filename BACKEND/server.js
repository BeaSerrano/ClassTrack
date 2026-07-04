require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const autenticacionRoutes = require('./routes/autenticacionRoutes');
const cursoRoutes = require('./routes/cursoRoutes');
const tareaRoutes = require('./routes/tareaRoutes');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/autenticacion', autenticacionRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/tareas', tareaRoutes);

app.get('/', (req, res) => {
  res.json({ message: '👌 ClassTrack API funcionando' });
});

// Manejador de errores centralizado
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || '❌ Error interno del servidor',
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Servidor http://localhost:${PORT} en el puerto ${PORT}`));
