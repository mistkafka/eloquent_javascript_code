'use strict'

// ========================================lib========================================
const _ = {
  $: function(query) {
    return document.querySelectorAll(query);
  },
  remove: function() {
    this.parentElement.removeChild(this);
  },
  elt: function(tagName, classNames) {
    let elt = document.createElement(tagName);
    if (elt) elt.className = classNames;
    return elt;
  }
};

const actorChar = {
  '@': Player,
  'o': Coin,
  '=': Lava, '|': Lava, 'v': Lava
};

const MAX_STEP = 0.05;
const WOBBLE_SPEED = 8;
const WOBBLE_DIST = 0.07;
const PLAYER_X_SPEED = 7;
const PLAYER_JUMP_SPEED = 17;
const GRAVITY = 30;
const ARROW_CODES = {37: 'left', 38: 'up', 39: 'right'};


function Level(plan) {
  this.width = plan[0].length;
  this.height = plan.length;
  this.grid = [];
  this.actors = [];
  this.status = null;
  this.finishDelay = null;
  this.player = null;

  for (let y = 0; y < this.height; y++) {
    let gridLine = [];
    let line = plan[y];
    for (let x = 0; x < this.width; x++) {
      let fieldType = null;
      let ch = line[x];
      let Actor = actorChar[ch];


      if (Actor) {
        this.actors.push(new Actor(new Vector(x, y), ch));
      } else if (ch == 'x') {
        fieldType = 'wall';
      } else if (ch == '!') {
        fieldType = 'lava';
      }

      gridLine.push(fieldType);
    }
    this.grid.push(gridLine);
  }

  this.player = this.actors.filter((actor) => actor.type == 'player')[0];
}
Level.prototype.isFinished = function() {
  return this.status != null && this.finishDelay < 0;
};
Level.prototype.obstacleAt = function(pos, size) {
  let xStart = Math.floor(pos.x);
  let xEnd = Math.ceil(pos.x + size.x);
  let yStart = Math.floor(pos.y);
  let yEnd = Math.ceil(pos.y + size.y);

  if (xStart < 0 || xEnd > this.width || yStart < 0) {
    return 'wall';
  }
  if (yEnd > this.height) {
    return 'lava';
  }

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      let fieldType = this.grid[y][x];
      if (fieldType) return fieldType;
    }
  }
};
Level.prototype.actorAt = function(actor) {
  for (let i = 0; i < this.actors.length; i++) {
    let another = this.actors[i];
    if (another != actor &&
        actor.pos.x + actor.size.x > another.pos.x &&
        actor.pos.x < another.pos.x + another.size.x &&
        actor.pos.y + actor.size.y > another.pos.y &&
        actor.pos.y < another.pos.y + another.size.y) {
      return another;
    }
  }
};
Level.prototype.animate = function(step, keys) {
  if (this.status != null) {
    this.finishDelay -= step;
  }

  while (step > 0) {
    let thisStep = Math.min(step, MAX_STEP);
    this.actors.forEach((actor) => {
      actor.act(thisStep, this, keys);
    });
    step -= thisStep;
  }
};
Level.prototype.playerTouched = function(type, actor) {
  if (type == 'lava' && this.status == null) {
    this.status = 'lost';
    this.finishDelay = 1;
  } else if (type == 'coin') {
    this.actors = this.actors.filter((other) => {
      return other != actor;
    });
    if (!this.actors.some((actor) =>  actor.type == 'coin')) {
      this.status = 'won';
      this.finishDely = 1;
    }
  }
};


function Vector(x, y) {
  this.x = x;
  this.y = y;
}
Vector.prototype.plus = function(another) {
  return new Vector(this.x + another.x, this.y + another.y);
};
Vector.prototype.times = function(factor) {
  return new Vector(this.x * factor, this.y * factor);
};
Vector.prototype.equal = function(another) {
  return this.x.toFixed(2) == another.x.toFixed(2) &&
    this.y.toFixed(2) == another.y.toFixed(2);
}

function Player(pos) {
  this.pos = pos.plus(new Vector(0, -0.5));
  this.size = new Vector(0.8, 1.5);
  this.speed = new Vector(0, 0);
}
Player.prototype.type = 'player';
Player.prototype.moveX = function(step, level, keys) {
  this.speed.x = 0;
  if (keys.left) this.speed.x -= PLAYER_X_SPEED;
  if (keys.right) this.speed.x += PLAYER_X_SPEED;

  let motion = new Vector(this.speed.x * step, 0);
  let newPos = this.pos.plus(motion);
  let obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle) {
    level.playerTouched(obstacle);
  } else {
    this.pos = newPos;
  };
};
Player.prototype.moveY = function(step, level, keys) {
  this.speed.y += step * GRAVITY;
  let motion = new Vector(0, this.speed.y * step);
  let newPos = this.pos.plus(motion);
  let obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle) {
    level.playerTouched(obstacle);
    if (keys.up && this.speed.y > 0) {
      this.speed.y = -PLAYER_JUMP_SPEED;
    } else {
      this.speed.y = 0;
    }
  } else {
    this.pos = newPos;
  }
};
Player.prototype.act = function(step, level, keys) {
  this.moveX(step, level, keys);
  this.moveY(step, level, keys);

  let otherActor = level.actorAt(this);
  if (otherActor) {
    level.playerTouched(otherActor.type, otherActor);
  }

  // Losing animation, "shrink"
  if (level.status == 'lost') {
    this.pos.y += step;
    this.size.y -= step;
  }
}

function Lava(pos, ch) {
  this.pos = pos;
  this.size = new Vector(1, 1);

  if (ch == '=') {
    this.speed = new Vector(2, 0);
  } else if (ch == '|') {
    this.speed = new Vector(0, 2);
  } else if (ch == 'v') {
    this.speed = new Vector(0, 3);
    this.repeatPos = pos;
  }
}
Lava.prototype.type = 'lava';
Lava.prototype.act = function(step, level) {
  let newPos = this.pos.plus(this.speed.times(step));

  if (!level.obstacleAt(newPos, this.size)) {
    this.pos = newPos;
  } else if (this.repeatPos) {
    this.pos = this.repeatPos;
  } else {
    this.speed = this.speed.times(-1);
  }
};

function Coin(pos) {
  this.pos = this.basePos = pos.plus(new Vector(0.2, 0.1));
  this.size = new Vector(0.6, 0.6);
  this.wobble = Math.random() * Math.PI * 2;
}
Coin.prototype.type = 'coin';
Coin.prototype.act = function(step) {
  this.wobble += step * WOBBLE_SPEED;
  let wobblePos = Math.sin(this.wobble) * WOBBLE_DIST;
  this.pos = this.basePos.plus(new Vector(0, wobblePos));
};


// ========================================DOM Display========================================
const SCALE = 20;

function DOMDisplay(parent, level) {
  this.wrap = parent.appendChild(_.elt('div', 'game'));
  this.level = level;

  this.wrap.appendChild(this.drawBackground());
  this.actorLayer = null;
  this.drawFrame();
}

DOMDisplay.prototype.drawBackground = function() {
  let table = _.elt('table', 'background');

  table.style.width = this.level.width * SCALE + 'px';
  this.level.grid.forEach((row) => {
    let rowElt = table.appendChild(_.elt('tr'));
    rowElt.style.height = SCALE + 'px';
    row.forEach((type) => {
      let cell = rowElt.appendChild(_.elt('td', type));
    });
  });

  return table;
};

DOMDisplay.prototype.drawActors = function() {
  let wrap = _.elt('div');
  this.level.actors.forEach((actor) => {
    let rect = wrap.appendChild(_.elt('div', 'actor ' + actor.type));
    rect.style.width = actor.size.x * SCALE + 'px';
    rect.style.height = actor.size.y * SCALE + 'px';
    rect.style.left = actor.pos.x * SCALE + 'px';
    rect.style.top = actor.pos.y * SCALE + 'px';
  });

  return wrap;
};

DOMDisplay.prototype.drawFrame = function() {
  if (this.actorLayer) {
    _.remove.call(this.actorLayer);
  }
  this.actorLayer = this.wrap.appendChild(this.drawActors());
  this.wrap.className = 'game ' + (this.level.status || '');
  debugger;
  this.scrollPlayerIntoView();
};

DOMDisplay.prototype.scrollPlayerIntoView = function() {
  let width  = this.wrap.clientWidth;
  let height = this.wrap.clientHeight;
  let margin = width / 3;

  // The viewportg
  let left = this.wrap.scrollLeft;
  let right = left + width;
  let top = this.wrap.scrollTop;
  let bottom = top + height;

  let player = this.level.player;
  let center = player.pos.plus(player.size.times(0.5)).times(SCALE);

  // x
  if (center.x < left + margin) {
    this.wrap.scrollLeft = center.x - margin;
  } else if (center.x > right - margin) {
    this.wrap.scrollLeft = center.x + margin - width;
  }
  // y
  if (center.y < top + margin) {
    console.log('should move to top');
    this.wrap.scrollTop = center.y - margin;
  } else if (center.y > bottom - margin) {
    console.log('should move to bottom');
    this.wrap.scrollTop = center.y + margin - height;
  }
};

DOMDisplay.prototype.clear = function() {
  _.remove.call(this.wrap);
};

//====================For Running====================
function trackKeys(codes) {
  let pressed = Object.create(null);
  function handler(event) {
    if (codes.hasOwnProperty(event.keyCode)) {
      let down = event.type === 'keydown';
      pressed[codes[event.keyCode]] = down;
      event.preventDefault();
    }
  }

  addEventListener('keydown', handler);
  addEventListener('keyup', handler);

  return pressed;
};

function runAnimation(frameFunc) {
  let lastTime = null;
  function frame(time) {
    let stop = false;
    if (lastTime != null) {
      let timeStep = Math.min(time - lastTime, 100) / 1000;
      stop = frameFunc(timeStep) === false;
    }
    lastTime = time;

    if (!stop) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
};

let arrows = trackKeys(ARROW_CODES);

function runLevel(level, Display, andThen) {
  let display = new Display(document.body, level);

  runAnimation((step) => {
    level.animate(step, arrows);
    display.drawFrame(step);
    if (level.isFinished()) {
      display.clear();
      if (andThen) {
        andThen(level.status);
      }
      return false;
    }
  });
};

function runGame(plans, Display) {
  function startLevel(n) {
    runLevel(new Level(plans[n]), Display, (status) => {
      if (status == 'lost') {
        startLevel(n);
      } else if (n < plans.length - 1) {
        startLevel(n + 1);
      } else {
        console.log('You win!');
      }
    });
  }
  startLevel(0);
}
