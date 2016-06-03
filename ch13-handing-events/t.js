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

}());
