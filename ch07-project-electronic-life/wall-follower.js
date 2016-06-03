const _ = require('./helper');

function WallFollower() {
  this.dir = 's';
}

WallFollower.prototype.act = function(view) {

  let startDir = this.dir;

  // has just passed obstacle, start from left
  if (view.look(_.dirPlus(this.dir, -3)) != ' ') {
    startDir = this.dir = _.dirPlus(this.dir, -2);
  }

  while (view.look(this.dir) != ' ') {
    this.dir = _.dirPlus(this.dir, 1);

    if (this.dir == startDir) break;
  }

  return {type: 'move', direction: this.dir};
}


module.exports = WallFollower;
