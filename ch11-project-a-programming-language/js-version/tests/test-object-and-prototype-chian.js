// support object and prototype chain
run(`
  do(
    define(anim, objectCreate(null)),
    objectSet(anim, "weight", 10),
    print(objectGet(anim, "weight")),

    define(cat, objectCreate(anim)),
    print(objectGet(cat, "weight")),

    objectSet(cat, "weight", 3),
    print(objectGet(cat, "weight")),
    print(objectGet(anim, "weight"))
  )
`);
