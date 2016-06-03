// my ugly code
for (var n = 1; n <= 100; n++) {
  if (n % 3 == 0 && n % 5 == 0) {
    console.log('FizzBuzz');
    continue;
  }
  if (n % 3 == 0) {
    console.log('Fizz')
    continue;
  }
  if (n % 5 == 0) {
    console.log('Buzz');
    continue;
  }
  console.log(n);
}

// example code
for (var n = 1; n <= 100; n++) {
  var output = '';
  if (n % 3 == 0) {
    output += 'Fizz';
  }
  if (n % 5 == 0) {
    output += 'Buzz';
  }

  console.log(output || n);
}
