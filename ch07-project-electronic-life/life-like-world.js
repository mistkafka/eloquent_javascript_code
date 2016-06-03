const World = require('./world');
const View = require('./view');
const _ = require('./helper');

const actionTypes = Object.create(null);


function LifeLikeWorld(map, legend) {
  World.call(this, map, legend);
}
LifeLikeWorld.prototype = Object.create(World.prototype);

LifeLikeWorld.prototype._letAct = function(critter, vector) {
  let action = critter.act(new View(this, vector));
  let handled = action &&
        action.type in actionTypes &&
        actionTypes[action.type].call(this, critter, vector, action);

  if (!handled) {
    critter.energy -= 0.2;

    if (critter.energy <= 0) {
      this.grid.set(vector, null);
    }
  }
};

actionTypes.grow = function(critter) {
  critter.energy += 0.5;
  return true;
};

actionTypes.move = function(critter, vector, action) {
  let dest = this._checkDestination(action, vector);
  if (dest == null ||
      critter.energy <= 1 ||
      this.grid.get(dest) != null) {
    return false;
  }

  critter.energy -= 1;
  this.grid.set(vector, null);
  this.grid.set(dest, critter);

  return true;
};

actionTypes.eat = function(critter, vector, action) {
  let dest = this._checkDestination(action, vector);
  let destObj = dest && this.grid.get(dest);

  if (!destObj || destObj.energy == null) {
    return false;
  }

  critter.energy += destObj.energy;
  this.grid.set(dest, null);
  return true;
};

actionTypes.reproduce = function(critter, vector, action) {
  let baby = _.elementFromChar(this.legend, critter.originChar);
  let dest = this._checkDestination(action, vector);

  if (dest == null ||
      critter.energy <=  2 * baby.energy ||
      this.grid.get(dest) != null) {
    return false;
  }

  critter.energy -= 2 * baby.energy;
  this.grid.set(dest, baby);
  return true;
};

module.exports = LifeLikeWorld;
