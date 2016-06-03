// call

var obj = {num: 2};

function plusToThis(a, b, c) {
  return this.num + a +  b + c;
}

console.log(plusToThis.call(obj, 1, 2, 3));
var args = [1, 2, 3]
console.log(plusToThis.apply(obj, args));

console.dir(plusToThis);
