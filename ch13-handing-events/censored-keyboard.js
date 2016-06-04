function createAboardMap(str) {
  let map = new Map();
  Array.from(str).forEach((ch) => {
    map.set(ch.charCodeAt(0), true);
  });
  return map;
}

(function() {
  let inputer = document.getElementById('inputer');
  let aboardMap = createAboardMap('qwxQWX');
  inputer.addEventListener('keypress', (event) => {
    if (aboardMap.get(event.keyCode)) {
      event.preventDefault();
    }
  });
}());
