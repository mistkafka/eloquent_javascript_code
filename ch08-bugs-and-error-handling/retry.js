'use strict'

function primitiveMultiply(a, b) {
  if (Math.random() < 0.5) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure('unlucky');
  }
}

function MultiplicatorUnitFailure(message) {
  this.message = message;
  this.stack = new Error('').stack;
}
MultiplicatorUnitFailure.prototype = Object.create(Error.prototype);


function retry() {
  while(true) {
    try {
      return primitiveMultiply(3, 4);
    } catch(e) {
      if (e instanceof MultiplicatorUnitFailure) {
        console.log(e.message);
      } else {
        throw e;
      }
    }
  }
}

console.log(retry());
