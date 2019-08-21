const run = require('../EggCompiler');

run(
  'do(define(plusOne, fun(a, +(a, 1))),',
  '   print(plusOne(10)))'
);

