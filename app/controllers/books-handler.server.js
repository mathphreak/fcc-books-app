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

        var detailsPromises = result.map(x => x.getDetails.catch(err => {
          console.error(err);
          return {};
        }));

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

        result.getDetails
          .then(() => res.redirect('/#' + result._id))
          .catch(err => {
            console.error(err);
            res.sendStatus(400).end();
            Books
              .findOneAndRemove({_id: result._id})
              .exec();
          });
      });
  };
}

module.exports = BooksHandler;
