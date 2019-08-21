const run = require('../EggCompiler');

// support async api
run(
  'do(define(cb, fun(print("async print"))), setTimeout(cb, 1000), print("sync print"))'
);

run(
  `
  do(
    define(timer, 0),
    define(count, 0),
    define(cb, fun(
      do(
        print(count),
        set(count, +(count, 1)),
        if(>(count, 11), clearInterval(timer), true)
      )
    )),
    set(timer, setInterval(cb, 1000))
  )
  `
);

