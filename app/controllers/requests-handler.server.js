'use strict';

var Requests = require('../models/requests.js');

function RequestsHandler() {
  this.getMyRequests = function (req, res) {
    Requests
      .find({})
      .populate('book requestor')
      // Unfortunately, query-after-populate is impossible
      // .or([{requestor: req.user._id}, {'book.owner': req.user._id}])
      .exec(function (err, result) {
        if (err) {
          throw err;
        }

        result = result.filter(request => {
          var myId = req.user._id;
          var ownReq = request.requestor._id.equals(myId);
          var ownBook = request.book.owner.equals(myId);
          return ownReq || ownBook;
        });

        var promises = result.map(request => {
          return request.book.getDetails.then(details => {
            return {
              _id: request._id,
              requestor: request.requestor,
              book: details
            };
          });
        });

        Promise.all(promises).then(details => res.json(details));
      });
  };

  this.addRequest = function (req, res) {
    Requests
      .create({requestor: req.user._id, book: req.params.book}, (err, result) => {
        if (err) {
          throw err;
        }

        res.redirect('/profile#' + result._id);
      });
  };
}

module.exports = RequestsHandler;
