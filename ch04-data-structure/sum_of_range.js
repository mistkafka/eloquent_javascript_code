function range(start, end, step) {
  var list = [];
  var _step = step ? Math.abs(step) : 1;

  for (var n = start; n <= end; n += _step) {
    list.push(n);
  }

  return step < 0 ? list.reverse() : list;
}

function sum(list) {
  return list.reduce((prev, currt) => prev + currt);
}

console.log(sum(range(1, 10)));
