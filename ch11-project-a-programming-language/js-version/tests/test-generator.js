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
    print("end example 1\n\n\n\n"),
  )
  `
);


// 带有if语句
run(
  `do(
    define(numberGenerator, gen(
      n,

      do(
        set(n, +(n, 1)),
        if(>(n, 10),
          yield(n),
          do(
            set(n, +(n, 10)),
            yield(n),
            set(n, -(n, 10))
          )
        ),

        set(n, +(n, 3)),
        if(==(0, %(n, 2)),
            yield(n),
            yield(+(n, 1))
        )
      )
    )),

    define(aGen, numberGenerator(3)),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print("end example 2\n\n\n\n"),
  )`
);


// 带有if跟while语句
run(
  `do(
    define(fibGenerator, gen(
      do(
        yield(1),
        define(f_2, 0),
        define(f_1, 1),
        define(f_0, 1),
        while(<(f_0, 100),
          do(
            set(f_0, +(f_1, f_2)),
            set(f_2, f_1),
            set(f_1, f_0),
            yield(f_0)
          )
        )
      )
    )),

    define(aGen, fibGenerator()),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print(objectGetApply(aGen, "next")),
    print("end example 3\n\n\n\n"),
  )`
);
