/* global document:false, appUrl:false, ajaxFunctions:false */

'use strict';

(function () {
  var reqList = document.querySelector('#request-list');
  var apiUrl = appUrl + '/api/requests';

  function buildLI(req) {
    var li = document.createElement('li');
    li.id = req._id;
    li.className = 'request';

    li.innerText = req.requestor.name + ' wants ' + req.book.details.title;
    return li;
  }

  ajaxFunctions.ready(function () {
    ajaxFunctions.ajaxRequest('GET', apiUrl, function (reqs) {
      reqs = JSON.parse(reqs);

      var hash = document.location.hash;
      document.location.hash = '';

      reqList.innerHTML = '';
      reqs.forEach(function (req) {
        reqList.appendChild(buildLI(req));
      });

      document.location.hash = hash;
    });
  });
})();
