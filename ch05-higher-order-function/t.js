var ANCESTRY_FILE = require('./ancestry');

var ancestry = JSON.parse(ANCESTRY_FILE);
console.log(ancestry.length);
var diedAfter1900 = ancestry.filter((person) => person.died > 1900);

console.log(diedAfter1900.map((person) => person.name));

console.log(ancestry.reduce((min, cur) => {
  return cur.born < min.born ? cur : min;
}));
