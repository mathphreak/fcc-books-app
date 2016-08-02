'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var User = new Schema({
  github: {
    id: String,
    username: String
  },
  name: String,
  city: String,
  state: String
});

User.virtual('location').get(function () {
  return this.city + ', ' + this.state;
});

module.exports = mongoose.model('User', User);
