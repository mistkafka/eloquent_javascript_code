// my code

function buildLine(length, line_type) {
  var pattern = line_type == 'odd' ? 'x#' : '#x';

  var copys = parseInt(length / 2);
  var line = '';
  for (var i = 0; i < copys; i++) {
    line += pattern;
  }
  return length % 2 == 0 ? line : line + pattern.substr(0, 1);
}

var size = 11;

if (size == 1) {
  console.log('x');
} else {
  var odd_line = buildLine(size, 'odd');
  var even_line = buildLine(size, 'even');
  var copys = parseInt(size / 2);
  for (var i = 0; i < copys; i++) {
    console.log(odd_line);
    console.log(even_line);
  }
  if (size % 2 != 0) {
    console.log(odd_line);
  }
}

console.log('=========version2=========')
var char = 'x';
for (var i = 0; i < size; i++) {
  var line = '';
  for (var j = 0; j < size; j++) {
    line += char;
    char = char == 'x' ? '#' : 'x';
   }
  console.log(line);
}


// example code
console.log('=========example=========');
var board = "";

for (var y = 0; y < size; y++) {
  for (var x = 0; x < size; x++) {
    if ((x + y) % 2 == 0)
      board += " ";
    else
      board += "#";
  }
  board += "\n";
}

console.log(board);
