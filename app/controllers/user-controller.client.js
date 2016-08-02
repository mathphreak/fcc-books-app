/* global document:false, appUrl:false, ajaxFunctions:false */

'use strict';

(function () {
  var profileId = document.querySelector('#profile-id') || null;
  var profileUsername = document.querySelector('#profile-username') || null;
  var displayName = document.querySelector('#display-name');
  var settingsForm = document.querySelector('#profile-settings') || null;
  var profileCity = document.querySelector('#profile-city') || null;
  var profileState = document.querySelector('#profile-state') || null;
  var profileEdit = document.querySelector('#profile-edit') || null;
  var apiUrl = appUrl + '/api/users/me';

  var notEditingContainer = document.querySelector('.github-profile') || null;
  notEditingContainer = notEditingContainer ? notEditingContainer.parentNode : null;

  var editingContainer = document.querySelector('#profile-settings') || null;
  editingContainer = editingContainer ? editingContainer.parentNode : null;

  var authDetailedStyle = document.createElement('style');

  function updateHtmlElement(data, element, userProperty) {
    element.innerHTML = data[userProperty];
  }

  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
    document.body.appendChild(authDetailedStyle);

    var userObject = JSON.parse(data);

    if (userObject === false) {
      return;
    }

    authDetailedStyle.sheet.insertRule('.auth-hidden {display: none;}', 0);
    authDetailedStyle.sheet.insertRule('.auth-shown {display: unset;}', 0);

    if (userObject.name === null) {
      updateHtmlElement(userObject.github, displayName, 'username');
    } else {
      updateHtmlElement(userObject, displayName, 'name');
    }

    if (profileId !== null) {
      updateHtmlElement(userObject.github, profileId, 'id');
    }

    if (profileUsername !== null) {
      updateHtmlElement(userObject.github, profileUsername, 'username');
    }

    if (profileCity !== null) {
      updateHtmlElement(userObject, profileCity, 'city');
    }

    if (profileState !== null) {
      updateHtmlElement(userObject, profileState, 'state');
    }

    if (settingsForm !== null) {
      Array.prototype.forEach.call(settingsForm.querySelectorAll('input[type="text"]'), function (input) {
        input.value = userObject[input.name];
      });
    }

    if (profileEdit !== null) {
      profileEdit.addEventListener('click', function (evt) {
        evt.preventDefault();
        notEditingContainer.hidden = true;
        editingContainer.hidden = false;
      });
    }
  }));
})();
