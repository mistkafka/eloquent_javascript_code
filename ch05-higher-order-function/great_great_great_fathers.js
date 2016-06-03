const ANCESTRY_FILE = require('./ancestry');
const ancestry = JSON.parse(ANCESTRY_FILE);


var byName = ancestry.reduce((byNameMap, person) => {
  byNameMap[person.name] = person;
  return byNameMap;
}, {});

function sharedDNAFrom(ancestor) {
  return function(person, fromMother, fromFather) {
    if (person.name == ancestor) {
      return 1;
    }

    return (fromMother + fromFather) / 2;
  };
}

function reduceAncestors(person, sharedDNAFun, outsideValue) {
  return valueFor(person);

  function valueFor(person) {
    if (person == null) {
      return null;
    }

    return sharedDNAFun(person,
                        valueFor(byName[person.mother]),
                        valueFor(byName[person.father])
                       );
  }
}

var sharedDNAFrom_Pauwels_van_Haverbeke = sharedDNAFrom('Pauwels van Haverbeke');

var ph = byName['Philibert Haverbeke'];
console.log(reduceAncestors(ph, sharedDNAFrom_Pauwels_van_Haverbeke, 0) / 4);
