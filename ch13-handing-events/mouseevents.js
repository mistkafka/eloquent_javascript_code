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

(function() {
  let parent = $('#parent');
  let child = $('#child');

  parent.addEventListener('mouseover', (event) => {
    parent.style.backgroundColor = '#833812';
  });
  parent.addEventListener('mouseout', (event) => {
    parent.style.backgroundColor = 'white';
  });

  child.addEventListener('mouseover', (event) => {
    child.style.backgroundColor = '#283723';
  });
  child.addEventListener('mouseout', (evnet) => {
    child.style.backgroundColor = 'white';
  });
}());
