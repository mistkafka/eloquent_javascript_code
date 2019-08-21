const run = require('../EggCompiler');

run(
  'do(define(arr, array(1, 3, 5, 7, 9)), define(p, fun(arr, index, while(<(index, length(arr)), do(print(element(arr, index)), define(index, +(index, 1))) ))), p(arr, 0))'
);

