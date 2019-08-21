const run = require('../EggCompiler');

run(`
do(
  define(obj1, objectCreate(null)),
  objectSet(obj1, "name", "kafka"),
  objectSet(obj1, "display", fun(print(objectGet(this, "name")))),
  objectGetApply(obj1, "display")
)
`);
