const express = require('express');
const cors = require('cors'); // Importar cors
const { connectDB, sequelize } = require('./config/database');
const userRoutes = require('./routes/user.routes');
const bookRoutes = require('./routes/book.routes');
const { createDefaultBooks } = require('./services/book.service');

const app = express();

// Usar CORS globalmente
app.use(cors()); // Habilita CORS para todas las rutas

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 4000;

const main = async () => {
    await connectDB(); // Conectar a PostgreSQL

    // Sincronizar las tablas de la base de datos
    try {
        // Sincronizar todos los modelos (incluyendo relaciones)
        await sequelize.sync({ force: false }); // `force: false` significa que no eliminará las tablas existentes
        console.log('Tablas sincronizadas correctamente');

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al sincronizar las tablas:', error);
    }
    const initializeDefaults = async () => {
        try {
            console.log('Creando libros por defecto...');
            await createDefaultBooks();
            console.log('Libros por defecto creados con éxito.');
        } catch (error) {
            console.error('Error al crear libros por defecto:', error.message);
        }
    };

    // initializeDefaults();
};

main();
