const { v4 } = require('uuid');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const BookModel = require('./schemas/book-schema');
const userRoutes = require('./routers/user.routes');
const bookRoutes = require('./routers/book.routes');

app.use('/users', userRoutes);
app.use('/books', bookRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to database');
  } catch (err) {
    console.error(`Connection error`);
  }
  app.listen(
    process.env.PORT,
    console.log(`Server listen on port ${process.env.PORT}`)
  );
};

startServer();
