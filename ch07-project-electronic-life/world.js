const Grid = require('./grid');
const Vector = require('./vector');
const View = require('./view');
const _ = require('./helper');


/* World Class*/
function World(map, legend) {
  this.grid = new Grid(map[0].length, map.length);
  this.legend = legend;

  // version1(great): use => function
  map.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      this.grid.set(new Vector(x, y), _.elementFromChar(legend, line[x]));
    }
  });

//   // version2(cool maybe): use 'bind()'
//   map.forEach(function(line, y) {
//     for (let x = 0; x < line.length; x++) {
//       this.grid.set(new Vector(x, y), _.elementFromChar(legend, line[x]));
//     }
//   }.bind(this));
//
//   // version3(ugly): use 'local scope', a common pattern is 'var self = this'
//   var self = this;
//   map.forEach(function(line, y) {
//     for (let x = 0; x < line.length; x++) {
//       this.grid.set(new Vector(x, y), _.elementFromChar(legend, line[x]));
//     }
//   });
//
}

World.prototype.turn = function() {
  var acted = [];
  this.grid.forEach((critter, vector) => {
    if (critter.act && acted.indexOf(critter) == -1) {
      acted.push(critter);
      this._letAct(critter, vector);
    }
  });
}

World.prototype.toString = function() {
  var output = '';
  for (let y = 0; y < this.grid.height; y++) {
    for (let x = 0; x < this.grid.width; x++) {
      let e = this.grid.get(new Vector(x, y));
      output += _.charFromElement(e);
    }
    output += '\n';
  }

  return output;
}

World.prototype._letAct = function(critter, vector) {
  var action = critter.act(new View(this, vector));
  if (action && action.type == 'move') {
    var dest = this._checkDestination(action, vector);
    if (dest && this.grid.get(dest) == null) {
      this.grid.set(vector, null);
      this.grid.set(dest, critter);
    }
  }
}

World.prototype._checkDestination = function(action, vector) {
  if (!_.directions.hasOwnProperty(action.direction)) {
    return null;
  }

  let dest = vector.plus(_.directions[action.direction]);
  if (!this.grid.isInside(dest)) {
    return null;
  }

  return dest;
}

module.exports = World;
