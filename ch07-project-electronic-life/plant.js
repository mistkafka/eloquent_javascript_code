function Plant() {
  this.energy = 3 + Math.random() * 4;
}

Plant.prototype.act = function(view){
  if (this.energy > 15) {
    let space = view.find(' ');
    if (space) {
      return {type: 'reproduce', direction: space};
    }
  }

  if (this.energy < 20) {
    return {type: 'grow'};
  }
};

module.exports = Plant;
