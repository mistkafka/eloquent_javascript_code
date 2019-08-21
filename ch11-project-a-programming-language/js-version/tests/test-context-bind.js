const run = require('../EggCompiler');

run(`
do(
  define(display, fun(print(objectGet(this, "name")))),

  define(obj1, objectCreate(null)),
  objectSet(obj1, "name", "kafka"),

  define(obj2, objectCreate(null)),
  objectSet(obj2, "name", "kk"),
  
  define(obj1Display, bind(display, obj1)),
  define(obj2Display, bind(display, obj2)),

  obj1Display(),
  obj2Display(),
)
`);
