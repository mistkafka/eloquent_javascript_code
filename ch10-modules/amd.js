'use strict'
/*
 * AMD: asynchronous module define
 *
 */

const fs = require('fs');

let defineCache = Object.create(null);

function define(dependencysFileName, cb) {
  let dependencys = [];
  for (let fileName of dependencysFileName) {
    getModule(fileName, (module) => {
      let index = dependencysFileName.indexOf(fileName);
      dependencys[index] = module;
      if (dependencys.length == dependencysFileName.length) {
        cb.apply(null, dependencys);
      }
    });
  }
}

function getModule(fileName, cb) {
  if (fileName in defineCache) {
    cb(defineCache[fileName]);
    return;
  }
  fs.readFile('./' + fileName, 'utf-8', function(err, codes) {
    let builder = new Function('exports, module', codes);
    let exports = {};
    let module = {exports: exports};
    builder(exports, module);
    defineCache[fileName] = module.exports;
    cb(module.exports);
  });
}


define(['cat.js', 'week-day.js'], (Cat, weekDay) => {
  let redCat = new Cat('red');
  redCat.display();
  console.log(weekDay.name(3));
});
