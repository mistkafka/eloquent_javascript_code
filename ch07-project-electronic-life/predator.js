function Predator() {
  this.energy = 40;
}

Predator.prototype.act = function(view) {
  let space = view.find(' ');
  if (space && this.energy > 110) {
    return {type: 'reproduce', direction: space};
  }

  let critter = view.find('O');
  if (critter) {
    return {type: 'eat', direction: critter};
  }

  if (space) {
    return {type: 'move', direction: space};
  }

  return null;
}

module.exports = Predator;
