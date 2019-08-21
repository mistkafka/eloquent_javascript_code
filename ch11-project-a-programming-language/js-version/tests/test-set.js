const run = require('../EggCompiler');

// scope "bug"(I don't think it's a bug)
run(
  'do(define(a, 0), define(f, fun(define(a, 7))), f(), print(a))'
); // 0, but we hope it can be 7

// fix scope bugs, use set
run(
  'do(define(a, 0), define(f, fun(set(a, 7))), f(), print(a))'
);


