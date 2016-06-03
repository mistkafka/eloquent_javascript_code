const Vector = require('./vector');


function randomElements(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

function elementFromChar(legend, char) {
  if (char == ' ') return null;

  let element = new legend[char]();
  element.originChar = char;
  return element;
}

function charFromElement(e) {
  return e == null ? ' ' : e.originChar;
}

const directions = {
  n: new Vector(0, -1),
  ne: new Vector(1, -1),
  e: new Vector(1, 0),
  se: new Vector(1, 1),
  s: new Vector(0, 1),
  sw: new Vector(-1, 1),
  w: new Vector(-1, 0),
  nw: new Vector(-1, -1)
};

const directionNames = 'n ne e se s sw w nw'.split(' ');

function dirPlus(dir, n) {
  let index = directionNames.indexOf(dir);
  return directionNames[(index + n + 8) % 8];
}


exports.dirPlus = dirPlus;
exports.directionNames = directionNames;
exports.directions = directions;
exports.charFromElement = charFromElement;
exports.elementFromChar = elementFromChar;
exports.randomElements = randomElements;
