// my ugly code
var char = '#';
var line = '';
for (var i = 0; i < 7; i++) {
	line += char;
	console.log(line);
}

// example code
for (var line = '#'; line.length <= 7; line += '#')
	console.log(line);
