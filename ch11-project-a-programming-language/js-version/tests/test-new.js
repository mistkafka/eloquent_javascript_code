const run = require('../EggCompiler');


run(`
do(
  print("1. basic work: new, context, instanceof"),
  define(Animal, fun(
    name,
    do(
      objectSet(this, "kind", "animal"),
      objectSet(this, "name", name),
    ),
  )),

  define(AnimalPrototype, objectCreate(null)),
  objectSet(AnimalPrototype, "displayKind", fun(print(objectGet(this, "kind")))),
  objectSet(AnimalPrototype, "displayName", fun(print(objectGet(this, "name")))),

  objectSet(Animal, "prototype", AnimalPrototype),

  define(animal, new(Animal, "Gates")),
  objectGetApply(animal, "displayKind"),
  objectGetApply(animal, "displayName"),

  define(animal2, new(Animal, "Jobs")),
  objectGetApply(animal2, "displayKind"),
  objectGetApply(animal2, "displayName"),

  objectSet(animal, "name", "Bill Gates"),
  objectGetApply(animal, "displayName"),
  objectGetApply(animal2, "displayName"),
  print(instanceof(animal, Animal)),
  print(instanceof(animal2, Animal)),
  print(instanceof(animal2, animal)),
  
  print("\n\n\n2. inherit"),
  define(Fish, fun(
    swimSpeed,
    name,
    do(
      call(this, Animal, name),
      objectSet(this, "swimSpeed", swimSpeed),
      objectSet(this, "kind", "fish"),
    ))
  ),
  define(FishPrototype, objectCreate(AnimalPrototype)),
  objectSet(FishPrototype, "displayName", fun(do(
    print("name: "),
    print(objectGet(this, "name")),
    print("swimSpeed: "),
    print(objectGet(this, "swimSpeed")),
    print(),
  ))),
  objectSet(Fish, "prototype", FishPrototype),
  define(kun, new(Fish, "100km/s", "kun")),
  objectGetApply(kun, "displayName"),
  objectGetApply(animal, "displayName"),
  print(instanceof(kun, Animal)),
  print(instanceof(kun, Fish)),
  print(instanceof(animal, Fish))
)
`);
