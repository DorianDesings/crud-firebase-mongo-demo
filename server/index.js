const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
const { Server } = require('socket.io');
const server = require('http').Server(app);
const io = new Server(server, {
  cors: {
    origin: '*', // O cambia '*' por la URL de tu aplicación de React
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'] // Corrige el nombre del encabezado
  }
});
const cors = require('cors');

app.use(express.json());
app.use(cors());

require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const userRoutes = require('./routers/user.routes');
const bookRoutes = require('./routers/book.routes');

app.use('/users', userRoutes);
app.use('/books', bookRoutes);

// Configura la conexión a MongoDB
const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri);

io.on('connection', socket => {
  console.log('Cliente conectado');

  // Maneja la solicitud de cambio de colección
  socket.on('startCollectionListener', () => {
    // Establece el cambio de flujo (change stream) en la colección
    const collectionUsers = client.db('library').collection('users');
    const changeStreamUsers = collectionUsers.watch();

    // Escucha los eventos de cambio en el flujo y los emite a través del socket
    changeStreamUsers.on('change', change => {
      socket.emit('collectionUsersChange', change);
    });

    const collectionBooks = client.db('library').collection('books');
    const changeStreamBooks = collectionBooks.watch();

    // Escucha los eventos de cambio en el flujo y los emite a través del socket
    changeStreamBooks.on('change', change => {
      socket.emit('collectionChange', change);
    });
  });

  // Maneja la desconexión del cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(process.env.SOCKET_IO_PORT, () => {
  console.log(
    `Servidor Socket.io escuchando en el puerto ${process.env.SOCKET_IO_PORT}`
  );
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to database');
  } catch (err) {
    console.error(`Connection error`);
  }
  app.listen(
    process.env.EXPRESS_PORT,
    console.log(`Server listen on port ${process.env.EXPRESS_PORT}`)
  );
};

startServer();
