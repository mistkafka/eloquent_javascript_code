const _ = require('./helper');


function View(world, vector) {
  this.world = world;
  this.vector = vector;
}

View.prototype.look = function(dir) {
  var target = this.vector.plus(_.directions[dir]);
  if (!this.world.grid.isInside(target)) {
    return '#';
  }

  return _.charFromElement(this.world.grid.get(target));
};

View.prototype.find = function(ch) {
  var founds = this.findAll(ch);
  if (founds.length == 0) return null;
  return _.randomElements(founds);
};

View.prototype.findAll = function(ch) {
  var founds = [];
  for (dir in _.directions) {
    if (this.look(dir) == ch) {
      founds.push(dir);
    }
  }

  return founds;
};

module.exports = View;
