function PlantEater() {
  this.energy = 20;
}

PlantEater.prototype.act = function(view) {
  let space = view.find(' ');
  if (space && this.energy > 60) {
    return {type: 'reproduce', direction: space};
  }

  let plant = view.find('*');
  if (plant) {
    return {type: 'eat', direction: plant};
  }

  if (space) {
    return {type: 'move', direction: space};
  }

  return false;
}

module.exports = PlantEater;
