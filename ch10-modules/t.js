'use strict'
const fs = require('fs');



const dayName = function() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return function(number) {
    return days[number];
  };
}();
//console.log(dayName(1));


// // immediately exec function
// (function() {
//   console.log('hello');
// })();

const weekDay = function() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return {
    name: function(number) {
      return days[number];
    },
    number: function(name) {
      return days.indexOf(name);
    }
  };
}();
//console.log(weekDay.name(0));
//console.log(weekDay.number('Friday'));


(function(exports) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  exports.name = function(number) {
    return days[number];
  };

  exports.number = function(name) {
    return days.indexOf(name);
  };
})(this.weekDay = {});
//console.log(weekDay.name(1));


// show how eval poluate the scop. it's no use in strict mode
function evalTest(code) {
  let evalRt = eval(code);
 // console.log('x is:' + x);
  console.log('eval return:' + evalRt);
}
//evalTest('var x = 1; x');



let plusOne = new Function('n', 'return n + 1;');
//console.log(plusOne(4));

// my require: version 1. sync load file.
function myRequire(fileName) {
  //  let exports = {};
  //  return fs.readFile('./' + fileName, (err, data) => {
  //    let exportsBuilder = new Function('exports', data);
  //    return exportsBuilder(exports);
  //  });
  let codes = fs.readFileSync('./' + fileName, 'utf-8');
  let exportsBuilder = new Function('exports', codes);
  let exports = {};
  exportsBuilder(exports);

  return exports;
}

let weekDay2 = myRequire('week-day.js');
//console.log(weekDay2.name(6));
//console.log(weekDay2.number('Friday'));


// my require: v2. can exports value.
function myRequire2(fileName) {
  if (fileName in myRequire2.cache) {
    console.log(fileName + ' have load, get from cache');
    return myRequire2.cache[fileName];
  }
  let codes = fs.readFileSync('./' + fileName, 'utf-8');
  let exports = {};
  let module = {exports: exports};
  let exportBuilder = new Function('exports, module', codes);
  exportBuilder(exports, module);
  myRequire2.cache[fileName] = module.exports;

  return module.exports;
}
myRequire2.cache = Object.create(null);

//const Cat = myRequire2('cat.js');
//let redCat = new Cat('red');
//redCat.display();
// // verify cache
//const Cat2 = myRequire2('cat.js');
