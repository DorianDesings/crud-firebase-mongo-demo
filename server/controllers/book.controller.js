const BookModel = require('../schemas/book-schema');

const controller = {};

controller.getAllBooks = async (req, res) => {
  const booksDemo = [
    {
      _id: '1',
      title: 'Libro 1',
      userEmail: 'dorian1@gmail.com'
    },
    {
      _id: '2',
      title: 'Libro 2',
      userEmail: 'dorian1@gmail.com'
    },
    {
      _id: '3',
      title: 'Libro 3',
      userEmail: 'dorian2@gmail.com'
    }
  ];

  res.send(booksDemo);
};

module.exports = controller;
