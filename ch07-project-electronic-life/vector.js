module.exports = Vector;

function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.plus = function(another) {
  return new Vector(this.x + another.x, this.y + another.y);
}
