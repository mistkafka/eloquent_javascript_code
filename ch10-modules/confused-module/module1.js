function Cat(color) {
  this.color = color;
}

Cat.prototype.display = function() {
  console.log(this.color + ' cat!');
};

exports = {v1:1};
