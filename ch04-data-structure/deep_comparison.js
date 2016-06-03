function deepEqual(a, b) {
  if (typeof a != 'object' || typeof b != 'object') {
    return a == b;
  }

  if (a == null || b == null) {
    return a == b;
  }

  for (var pro in a) {
    if (a[pro] != b[pro]) {
      return false;
    }
  }

  for (var pro in b) {
    if (a[pro] != b[pro]) {
      return false;
    }
  }

  return true;
}

console.log('' + deepEqual({v1: 2, v2:3}, {v1:2, v2:3}));
console.log('' + deepEqual({v1: 2, v2:3}, {v1:2, v2:4}));
console.log('' + deepEqual({v1: 2, v2:3}, {v1:2, v2:3, v5:6}));
console.log('' + deepEqual({v1: 2, v2:3}, 3));
console.log('' + deepEqual({v1: 2, v2:3}, undefined));
console.log('' + deepEqual(null, null));
