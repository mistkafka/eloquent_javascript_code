function reverseArray(array) {
  var newArray = [];
  for (var i = array.length - 1; i >= 0; i--) {
    newArray.push(array[i]);
  }

  return newArray;
}

function reverseArrayInPlace(array) {
  for (var left = 0, right = array.length - 1; left < right; left++, right--) {
    var tmp = array[left];
    array[left] = array[right];
    array[right] = tmp;
  }

  //array = []; // we change the refeind veriable 'array' to [], but the veriable outside the function is not the local 'array'
  return array;
}

var list = [1, 2, 3, 4, 5, 6, 7];

console.log(reverseArray(list));
console.log(reverseArrayInPlace(list));
console.log(list);
