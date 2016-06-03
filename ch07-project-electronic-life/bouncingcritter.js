const Vector = require('./vector');
const _ = require('./helper');


function BouncingCritter() {
  this.direction = _.randomElements(_.directionNames);
}

BouncingCritter.prototype.act = function(view) {
  if (view.look(this.direction) != ' ') {
    this.direction = view.find(' ') || 's';
  }
  return {type: 'move', direction: this.direction};
}


module.exports = BouncingCritter;
