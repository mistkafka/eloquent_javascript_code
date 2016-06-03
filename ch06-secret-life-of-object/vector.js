function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Object.defineProperty(Vector.prototype, 'length', {
  get: function() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
});

Vector.prototype.plus = function(vct) {
  return new Vector(this.x + vct.x, this.y + vct.y);
}

Vector.prototype.minus = function(vct) {
  return new Vector(this.x - vct.x, this.y - vct.y);
}

// test
var v1 = new Vector(3, 4);
var v2 = new Vector(1, 3);
console.log(v1.length); // 5
console.log(v1.plus(v2).length); // 8.0622
console.log(v1.minus(v2).length); // 2.2360
