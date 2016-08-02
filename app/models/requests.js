'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Request = new Schema({
  requestor: {type: Schema.Types.ObjectId, ref: 'User'},
  book: {type: Schema.Types.ObjectId, ref: 'Book'}
});

module.exports = mongoose.model('Request', Request);
