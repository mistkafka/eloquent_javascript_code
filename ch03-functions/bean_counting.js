function countChar(str, char) {
  var counter = 0;
  for (var i = 0; i < str.length; i++) {
    if (str.charAt(i) == char) {
      counter++;
    }
  }
  return counter;
}


console.log(countChar('hello, world', 'o'));


// example code
// function countChar(string, ch) {
//   var counted = 0;
//   for (var i = 0; i < string.length; i++)
//     if (string.charAt(i) == ch)
//       counted += 1;
//   return counted;
//
// }
//
// function countBs(string) {
//   return countChar(string, "B");
//
// }
