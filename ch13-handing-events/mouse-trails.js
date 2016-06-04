(function(){
  let mouseTrails = document.getElementById('mouse-trails');
  addEventListener('mousemove', (event) => {
    mouseTrails.style.left = event.pageX + 'px';
    mouseTrails.style.top = event.pageY + 'px';
    console.log(event.pageX);
    console.log(event.pageY);
  });
}());
