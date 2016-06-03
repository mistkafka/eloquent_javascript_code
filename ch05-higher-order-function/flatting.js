function flattenArray(higherDimArray) {
  return higherDimArray.reduce((single, element) => {
    return single.concat(element);
  });
}

console.log(flattenArray([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
console.log(flattenArray([[1, 2, 3]]));
