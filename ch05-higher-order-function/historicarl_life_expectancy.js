const ANCESTRY_FILE = require('./ancestry');
const ancestry = JSON.parse(ANCESTRY_FILE);

function groupBy(groupFunc) {
  return function(arr) {
    var group = new Map();
    for (let element of arr) {
      let groupName = groupFunc(element);
      if (!group[groupName]) {
        group.set(groupName, []);
      }
      group.get(groupName).push(element);
    }

    return group;
  };
}

function centuryGroup(person) {
  return Math.ceil(person.died / 100);
}

function average(arr) {
  function plus(a, b) {return a + b};
  return arr.reduce(plus) / arr.length;
}


var groupByCentury = groupBy(centuryGroup);
var byCentury = groupByCentury(ancestry);

for (let [century, persons] of byCentury) {
  var ages = persons.map((person) => person.died - person.born);
  console.log('century ' + century + ' average age: ' + average(ages));
}
