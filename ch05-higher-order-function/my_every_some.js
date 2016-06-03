function some(arr, judgeFunc) {
  for (let e of arr) {
    if (judgeFunc(e)) return true;
  }

  return false;
}

function every(arr, judgeFunc) {
  for (let e of arr) {
    if (!judgeFunc(e)) return false;
  }

  return true;
}

var arr = [1, 3, 4, -8, 9];

function greaterThanZero(e) {
  return e > 0;
}

console.log(arr.some(greaterThanZero) == some(arr, greaterThanZero));
console.log(arr.every(greaterThanZero) == every(arr, greaterThanZero));
