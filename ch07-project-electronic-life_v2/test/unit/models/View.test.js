import { expect } from 'chai'
import View from '../../../src/models/View'
import World from '../../../src/models/World'
import Vector from '../../../src/models/Vector'
import Wall from '../../../src/models/Wall'
import Space from '../../../src/models/Space'
import BouncingCritter from '../../../src/models/BouncingCritter'

const worldMap = [
  '########',
  '# o o ##',
  '########',
]

const legend = {
  '#': Wall,
  'o': BouncingCritter,
  ' ': Space,
}

let world = new World(worldMap, legend)

let ins1 = new View(world, new Vector(1, 1))
let ins2 = new View(world, new Vector(0, 0))
let ins3 = new View(world, new Vector(3, 1))

describe('class View', () => {
  describe('#look(directionName)', () => {
    it('should basic work', () => {
      expect(ins1.look('e')).to.be.equal('o')
    })

    it('should return "#" when look outside world', () => {
      expect(ins2.look('w')).to.be.equal('#')
    })
  })

  describe('#find(target)', () => {
    it('should return a direction name when target is exists', () => {
      expect(typeof ins1.find('#')).to.be.equal('string')
    })

    it('should return null when target is not exists', () => {
      expect(ins2.find('o')).to.be.equal(null)
    })
  })

  describe('#findAll(target)', () => {
    it('basic work', () => {
      let directions = ins3.findAll('o')

      expect(directions.length).to.be.equal(2)
      expect(directions.includes('e')).to.be.ok
      expect(directions.includes('w')).to.be.ok
    })
  })
})
