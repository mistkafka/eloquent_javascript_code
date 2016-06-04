(function(){
  'use strict'

  let bomTimer = setTimeout(() => {
    console.log('Bom!!!!!!!!')
  }, 3000);
  if (Math.random() < 0.5) {
    console.log('Defused');
    clearTimeout(bomTimer);
  }

  let noiseTimer = setInterval(() => {
    console.log('Haha, you don\'t konw the answer!');
    if (Math.random() < 0.1) {
      console.log('Well, you know now!');
      clearInterval(noiseTimer);
    }
  }, 200);
}());
