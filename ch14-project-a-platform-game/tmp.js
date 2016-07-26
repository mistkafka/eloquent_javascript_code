const GAME_LEVELS = require('./game_levels');

let level1 = GAME_LEVELS[0];

for (let y = 0; y < level1.length; y++ ) {
  for (let x = 0; x < level1[0].length; x++) {
    if (level1[y][x] == 'v') {
      console.log(`(${y}, ${x})`);
    }
  }
}
