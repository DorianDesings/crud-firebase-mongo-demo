const mongoose = require('mongoose');
const { BookSchema } = require('./book-schema');

const UserScheme = mongoose.Schema({
  _id: String,
  username: String,
  email: String,
  books: [BookSchema]
});

const UserModel = mongoose.model('User', UserScheme);

module.exports = UserModel;
