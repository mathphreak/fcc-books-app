'use strict';

var Books = require('../models/books.js');

function BooksHandler() {
  this.getBooks = function (req, res) {
    Books
      .find({})
      .exec(function (err, result) {
        if (err) {
          throw err;
        }

        var detailsPromises = result.map(x => x.getDetails);

        Promise.all(detailsPromises).then(details => res.json(details));
      });
  };

  this.addBook = function (req, res) {
    var normISBN = Books.normISBN(req.body.isbn);

    if (normISBN === null) {
      res.sendStatus(400).end();
      return;
    }

    Books
      .create({owner: req.user._id, isbn: normISBN}, (err, result) => {
        if (err) {
          throw err;
        }

        res.redirect('/#' + result._id);
      });
  };
}

module.exports = BooksHandler;
