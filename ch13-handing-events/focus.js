'use strict'

function $(query) {
  if (query == '') {
    return null;
  }

  if (query.indexOf('#') == 0) {
    return document.getElementById(query.slice(1));
  }

  return document.querySelectorAll(query);
}

(function(){
  let fields = $('input');
  let helpInfo = $('#help-info');
  Array.prototype.forEach.call(fields, (field) => {
    field.addEventListener('focus', (event) => {
      helpInfo.appendChild(document.createTextNode(event.target.getAttribute('help-data')));
    });

    field.addEventListener('blur', () => {
      while(helpInfo.firstChild) {
        helpInfo.removeChild(helpInfo.firstChild);
      }
     });
  });
}());
