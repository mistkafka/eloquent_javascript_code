let expect = chai.expect;

describe('Vector', () => {
  it('Vector#plus()', () => {
    let v = new Vector(3, 4);
    v = v.plus(new Vector(-9, 3.5));
    expect(v.equal(new Vector(-6, 7.5))).to.be.ok;
   });
  it('Vector#times()', () => {
    let v = new Vector(1.2, -3);
    v = v.times(3);
    expect(v.equal(new Vector(3.6, -9))).to.be.ok;
  });
});

describe('Player', () => {
  it('Player#Constructor', () => {
    let p = new Player(new Vector(1, 1));
    expect(p.type).to.be.equal('player');
    expect(p.pos.equal(new Vector(1, 0.5))).to.be.ok;
    expect(p.size.equal(new Vector(0.8, 1.5))).to.be.ok;
    expect(p.speed.equal(new Vector(0, 0))).to.be.ok;
  });
});

describe('Lava', () => {
  it('Lava#Constructor()', () => {
    let l = new Lava(new Vector(3, 3), '=');
    expect(l.pos.equal(new Vector(3, 3))).to.be.ok;
    expect(l.size.equal(new Vector(1, 1))).to.be.ok;
    expect(l.speed.equal(new Vector(2, 0))).to.be.ok;
    expect(l.type).to.be.equal('lava');

    l = new Lava(new Vector(0, 0), '|');
    expect(l.speed.equal(new Vector(0, 2))).to.be.ok;

    l = new Lava(new Vector(0, 0), 'v');
    expect(l.speed.equal(new Vector(0, 3))).to.be.ok;
    expect(l.repeatPos.equal(new Vector(0, 0))).to.be.ok;
  });
});

describe('Coin', () => {
  it('Coin#Constructor()', () => {
    let c = new Coin(new Vector(1, 1));
    expect(c.pos.equal(new Vector(1.2, 1.1))).to.be.ok;
    expect(c.size.equal(new Vector(0.6, 0.6))).to.be.ok;
    expect(c.type).to.be.equal('coin');
  });
});

describe('Level', () => {
  it('Level#Constructor()', () => {
    let level1 = GAME_LEVELS[0];
    let l = new Level(level1);
    expect(l.player).to.be.not.equal(undefined);
    expect(l.width).to.be.not.equal(undefined);
    expect(l.width).to.be.equal(level1[0].length);
    expect(l.height).to.be.equal(level1.length);
  });

  it('Level#isFinished()', () => {
    let level1 = GAME_LEVELS[0];
    let l = new Level(level1);
    expect(l.isFinished()).to.not.be.ok;
  });

  it('Level#obstacleAt()', () => {
    let level1 = GAME_LEVELS[0];
    let l = new Level(level1);
    let SIZE_1 = new Vector(1, 1);

    let posOverTop = new Vector(0, -1);
    let posOverBottom = new Vector(0, l.height);
    let posOverLeft = new Vector(-1, 0);
    let posOverRight = new Vector(l.width, 0);
    let posWall = new Vector(66, 6);
    let posSpace = new Vector(0, 0);

    expect(l.obstacleAt(posOverTop, SIZE_1)).to.be.equal('wall');
    expect(l.obstacleAt(posOverLeft, SIZE_1)).to.be.equal('wall');
    expect(l.obstacleAt(posOverRight, SIZE_1)).to.be.equal('wall');

    expect(l.obstacleAt(posOverBottom, SIZE_1)).to.be.equal('lava');

    expect(l.obstacleAt(posWall, SIZE_1)).to.be.equal('wall');
    expect(l.obstacleAt(posSpace, SIZE_1)).to.be.equal(undefined);
  });

  it('Level#actorAt()', () => {
    let level1 = GAME_LEVELS[0];
    let l = new Level(level1);
    let player = l.player;
    let posTouchLava = new Vector(7, 67);
    let posTouchCoin = new Vector(8, 36);
    let posTouchDropLava = new Vector(10, 67);
    let posNoOtherActor = new Vector(0, 0);

    let otherActor;
    player.pos = posTouchLava && expect(l.actorAt(player)).to.be.equal('');

  });

});

describe('_', () => {
  it('elt()', () => {
    let $e = _.elt('div', 'parent');
    expect($e.getAttribute('class')).to.contain('parent');

    $e = _.elt('div', 'parent container');
    expect($e.getAttribute('class')).to.contain('container');
     expect($e.getAttribute('class')).to.contain('parent');
  });

  it('Remove', () => {
    let $parent = _.elt('div', 'parent');
    let $child = _.elt('div', 'child');
    $parent.appendChild($child);
    _.remove.call($child);
    let childElementCount = Array.call($parent.childNodes).filter((node) => {
      return node.nodeType == document.ELEMENT_NODE;
    });

    expect(childElementCount).to.be.empty;
  });
});
