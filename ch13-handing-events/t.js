'use strict'

function listener1() {
  console.log('This is listener 1');
}

function listener2() {
  console.log('This is listener 2');
}

(function() {
  //  // addEventListener and removeEventListener
  //  let btn1 = document.getElementById('btn1');
  //  btn1.addEventListener('click', listener1);
  //  btn1.addEventListener('click', listener2);

  // event propagation
  let btn1 = document.getElementById('btn1');
  let p1 = document.getElementById('p1')

  p1.addEventListener('mousedown', () => {
    console.log('hander for p1');
  });

  btn1.addEventListener('mousedown', (event) => {
    console.log('hander for btn1');
    if (event.which == 3) {
      event.stopPropagation();
    }
  });

  // preventDefault
  let link1 = document.getElementById('link1');
  link1.addEventListener('click', (event) => {
    console.log('Nope.');
    event.preventDefault();
  } );

//   // key event
//   addEventListener('keydown', (event) => {
//     document.body.style.background = 'red';
//   });
//   addEventListener('keyup', (event) => {
//     document.body.style.background = '';
//   });
  //

//    // combination keys
//    addEventListener('keydown', (event) => {
//      if (event.keyCode == 67 && event.altKey) {
//        alert('continue...');
//      }
//    });
//

  // keypress
  addEventListener('keypress', (event) => {
    console.log('keypress: ' + event.keyCode);
  });

  addEventListener('keydown', (event) => {
    console.log('keydown: ' + event.keyCode);
  });

  // resize bar
  let lastX;
  let bar = document.getElementById('div1');

  function buttonPressed(event) {
    if (event.which != null) {
      return event.which != 0;
    } else {
      return event.button != 0;
    }
  }
  function moved(event) {
    if (!buttonPressed(event)) {
      removeEventListener('mousemove', moved);
    } else {
      let dist = event.pageX - lastX;
      let newWidth = Math.max(10, dist + bar.offsetWidth);
      bar.style.width = newWidth + 'px';
      lastX = event.pageX;
    }
  }
  bar.addEventListener('mousedown', (event) => {
    lastX = event.pageX;
    addEventListener('mousemove', moved);
    event.preventDefault();
  });
}());
