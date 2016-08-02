/* global document:false, appUrl:false, ajaxFunctions:false */

'use strict';

(function () {
  var booksList = document.querySelector('#books-list');
  var apiUrl = appUrl + '/api/books';

  function makeSpan(cl, text) {
    var result = document.createElement('span');
    result.className = cl;
    result.innerText = text;
    return result;
  }

  function buildLI(book) {
    var li = document.createElement('li');
    li.id = book._id;
    li.className = 'book';

    var thumb = document.createElement('img');
    thumb.src = book.details.imageLinks.thumbnail;
    thumb.className = 'cover';
    li.appendChild(thumb);

    li.appendChild(makeSpan('title', book.details.title));
    li.appendChild(document.createTextNode(' by '));
    li.appendChild(makeSpan('author', book.details.authors[0]));
    li.appendChild(document.createTextNode(' in '));
    li.appendChild(makeSpan('location', book.location));

    var request = document.createElement('button');
    request.innerText = 'Request';
    request.className = 'auth-shown';
    request.hidden = true;
    request.addEventListener('click', function () {
      ajaxFunctions.ajaxRequest('POST', appUrl + '/api/requests/' + book._id, function () {
        console.log('Requested!'); // TODO anything ever
      });
    });
    li.appendChild(request);
    return li;
  }

  ajaxFunctions.ready(function () {
    ajaxFunctions.ajaxRequest('GET', apiUrl, function (books) {
      books = JSON.parse(books);

      var hash = document.location.hash;
      document.location.hash = '';

      booksList.innerHTML = '';
      books.forEach(function (book) {
        booksList.appendChild(buildLI(book));
      });

      document.location.hash = hash;
    });
  });
})();
