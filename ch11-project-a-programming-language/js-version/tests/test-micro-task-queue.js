const run = require('../EggCompiler');

// support micro task queue
run(
  `
  do(
    define(majorCb, fun(print("major callback"))),
    define(microCb, fun(print("micro callback"))),
    setTimeout(majorCb, 0),
    setImmediate(microCb, 0),
    print("sync print")
  )
  `
);

