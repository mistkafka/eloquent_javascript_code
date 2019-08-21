const run = require('../EggCompiler');

run(
  'do(define(f, fun(a, fun(b, +(a, b)))),',
  'print(f(4)(5))) //this is comment'
);

