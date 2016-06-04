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
  let contentProgress = $('#content-process');
  addEventListener('scroll', (event) => {
    let parcent = ((scrollY + innerHeight)/ document.body.clientHeight) * 100;
    contentProgress.value = parcent;
  });
}());
