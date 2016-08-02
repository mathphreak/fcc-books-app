'use strict';

var mongoose = require('mongoose');
var ISBN = require('isbnjs');
var isbn = require('node-isbn');

var cache = {};

var Schema = mongoose.Schema;

var Book = new Schema({
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  isbn: String // since you can't do math to it, it isn't a Number
});

Book.statics.normISBN = function (i) {
  return ISBN.asIsbn13(i);
};

Book.virtual('getDetails').get(function () {
  return new Promise((resolve, reject) => {
    this.populate('owner', err => {
      if (err) {
        return reject(err);
      }
      var normISBN = ISBN.asIsbn13(this.isbn);
      if (normISBN in cache) {
        return resolve(cache[normISBN]);
      }
      isbn.resolve(normISBN, (err, book) => {
        if (err) {
          reject(err);
        } else {
          cache[normISBN] = {
            isbn: this.isbn,
            _id: this._id,
            location: this.owner.location,
            details: book
          };
          resolve(cache[normISBN]);
        }
      });
    });
  });
});

module.exports = mongoose.model('Book', Book);
