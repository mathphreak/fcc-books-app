'use strict';

var User = require('../models/users.js');

function UserHandler() {
  this.saveSettings = function (req, res) {
    User
      .findOneAndUpdate({_id: req.user._id}, {$set: {name: req.body.name, city: req.body.city, state: req.body.state}})
      .exec(function (err) {
        if (err) {
          throw err;
        }

        res.redirect('/profile');
      });
  };
}

module.exports = UserHandler;
