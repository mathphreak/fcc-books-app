'use strict';

var bodyParser = require('body-parser');

var path = process.cwd();
var BooksHandler = require(path + '/app/controllers/books-handler.server.js');
var UserHandler = require(path + '/app/controllers/user-handler.server.js');

module.exports = function (app, passport) {
  function forceAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }

  function forceAuthAPI(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.sendStatus(403).end();
  }

  var booksHandler = new BooksHandler();
  var userHandler = new UserHandler();

  var formParser = bodyParser.urlencoded({extended: false});

  app.route('/')
    .get(function (req, res) {
      res.sendFile(path + '/public/index.html');
    });

  app.route('/login')
    .get(function (req, res) {
      res.sendFile(path + '/public/login.html');
    });

  app.route('/logout')
    .get(function (req, res) {
      req.logout();
      res.redirect('/login');
    });

  app.route('/profile')
    .get(forceAuth, function (req, res) {
      res.sendFile(path + '/public/profile.html');
    });

  app.route('/api/users/me')
    .get(function (req, res) {
      if (req.isAuthenticated()) {
        res.json(req.user);
      } else {
        res.json(false);
      }
    })
    .post(forceAuthAPI, formParser, userHandler.saveSettings);

  app.route('/auth/github')
    .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

  app.route('/api/books')
    .get(booksHandler.getBooks)
    .post(forceAuth, formParser, booksHandler.addBook);
};
