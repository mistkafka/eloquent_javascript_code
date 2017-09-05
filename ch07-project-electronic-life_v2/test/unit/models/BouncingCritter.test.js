import View from '../../../src/models/View'
import World from '../../../src/models/World'
import Vector from '../../../src/models/Vector'
import Wall from '../../../src/models/Wall'
import Space from '../../../src/models/Space'
import BouncingCritter from '../../../src/models/BouncingCritter'
import Utils from '../../../src/common/utils'
import { expect } from 'chai'

let ins = new BouncingCritter('^')

const legend = {
  '#': Wall,
  'o': BouncingCritter,
  ' ': Space,
}

describe('class BouncingCritter', () => {
  describe('#constructor (legendChar)', () => {
    it('should call super(legendChar)', () => {
      expect(ins.legendChar).to.be.equal('^')
    })

    it('should get a init direction', () => {
      expect(Utils.directionNames.includes(ins.direction)).to.be.ok
    })
  })

  describe('#act(view)', () => {
    it('should return "s" when around is not space', () => {
      let worldMap = [
        '###',
        '#o#',
        '###',
      ]
      let world = new World(worldMap, legend)
      let bouncingCritter = world.grid.get(new Vector(1, 1))
      let view = new View(world, new Vector(1, 1))

      let oldDirection = bouncingCritter.direction
      let actObj = bouncingCritter.act(view)
      expect(actObj.type).to.be.equal('move')
      expect(actObj.direction).to.be.equal('s')
    })

    it('should return current direction when front is space', () => {
      let worldMap = [
        '#####',
        '#   #',
        '# o #',
        '#   #',
        '#####',
      ]
      let world = new World(worldMap, legend)
      let bouncingCritter = world.grid.get(new Vector(2, 2))
      let view = new View(world, new Vector(2, 2))

      let oldDirection = bouncingCritter.direction
      let newDirection = bouncingCritter.act(view).direction
      expect(newDirection).to.be.equal(oldDirection)
    })
  })
})
