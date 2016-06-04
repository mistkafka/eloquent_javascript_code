(function(){
  'use strict'
  addEventListener('click', (event) => {
    let dot = document.createElement('div');
    dot.className = 'dot';
    dot.style.left = (event.pageX - 4) + 'px';
    dot.style.top = (event.pageY - 4) + 'px';
    console.log('x:' + event.pageX + ' y:' + event.pageY);
    document.body.appendChild(dot);
  });
}())
