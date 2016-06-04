(function(){
  'use strict'
  let squareWorkder = new Worker('worker-code.js');

  // receive message from web worker
  squareWorkder.addEventListener('message', (event) => {
    console.log('The web worker response is: ' + event.data);
  });

  // send message to web worker
  squareWorkder.postMessage(46);
  squareWorkder.postMessage(66);
  squareWorkder.postMessage(86);
  squareWorkder.postMessage(106);

  // verify the runing is not be block
  alert('is work');
}());
