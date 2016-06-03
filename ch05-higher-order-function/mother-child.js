/**
 * 英语水平有限，不知道题目的意思有没有理解错了。意思应该是: 求母亲生孩子时的平均年龄，有几个孩子就计算几次。
 *
 */

const ANCESTRY_FILE = require('./ancestry');
const ANCESTRY = JSON.parse(ANCESTRY_FILE);
var mapByName = ANCESTRY.reduce((map, person) => {
  map[person.name] = person;
  return map;
}, {});

function countAgeForAncestry(counter, person) {
  if (mapByName[person.mother] == null) {
    return counter;
  }

  counter.children += 1;
  counter.ageSum += person.born - mapByName[person.mother].born;

  return counter;
}

var counter = ANCESTRY.reduce(countAgeForAncestry, {ageSum: 0, children: 0});
console.log(counter.ageSum / counter.children);


/* example code, greater */

function average(arr) {
  function plus(a, b) { return a + b; }
  return arr.reduce(plus) / arr.length;
}

var differences = ANCESTRY
      .filter((person) => mapByName[person.mother] != null)
      .map((person) => person.born - mapByName[person.mother].born);

console.log(average(differences));
