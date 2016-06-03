'aabbcc 192834 abc 2849238 expression'.replace(/([a-c]+) (\w+)/g, function(match, p1, p2, offset, str) {
  console.log(match);
  console.log(p1);
  console.log(p2);
  console.log(offset);
  console.log(str);
  console.log('----------------------------------------------------------------------');

  return '.';
});
