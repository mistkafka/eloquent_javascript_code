(function() {
  let cat = document.getElementById('cat');
  let hat = document.getElementById('hat');
  let angle = 0;
  let lastTime = null;

  function animate(time) {
    if (lastTime != null) {
      angle += (time - lastTime) * 0.003;
    }
    lastTime = time;
    let top = (Math.sin(angle) * 70);
    let left = (Math.cos(angle) * 200);
    cat.style.top = top + 'px';
    cat.style.left = left + 'px';
    hat.style.top = (-top) + 'px';
    hat.style.left = (-left) + 'px';

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}());
