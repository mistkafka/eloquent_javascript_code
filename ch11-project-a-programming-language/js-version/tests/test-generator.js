const run = require('../EggCompiler');

// 简单的generator，没有if、while
run(
  `
  do(
    define(numberGenerator, gen(
      do(
        define(n, 0),

        set(n, +(n, 1)),
        yield(n),

        set(n, +(n, 2)),
        yield(n),

        set(n, +(n, 3)),
        yield(n)
      )
    )),

    define(aGen, numberGenerator()),
    define(aGen2, numberGenerator()),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen2, "next")),
    print(objectGetApply(aGen2, "next")),
    print(objectGetApply(aGen2, "next")),
  )
  `
);
