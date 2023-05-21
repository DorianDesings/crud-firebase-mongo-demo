const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
  _id: String,
  title: String,
  author: String,
  photo: String,
  synopsis: String,
  price: Number,
  stock: Number
});

const BookModel = mongoose.model('Book', BookSchema);

module.exports = { BookSchema, BookModel };
