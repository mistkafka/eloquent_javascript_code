function isEven(n) {
  // filter
  if (n < 0) {
    n = -n;
  }

  // exit recursion
  if (n == 0) {
    console.log('is even');
    return true;
  }
  if (n == 1) {
    console.log('is odd')
    return false;
  }

  // recursion
  return isEven(n - 2);
}

// test
isEven(50);
isEven(75);
isEven(-1);
isEven(-2);


// example code
// function isEven(n) {
//   if (n == 0)
//     return true;
//   else if (n == 1)
//     return false;
//   else if (n < 0)
//     return isEven(-n);
//   else
//     return isEven(n - 2);
// }
