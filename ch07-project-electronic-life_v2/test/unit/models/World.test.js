import td from 'testdouble'
import { expect } from 'chai'
import World from '../../../src/models/World'
import Wall from '../../../src/models/Wall'
import Space from '../../../src/models/Space'
import BouncingCritter from '../../../src/models/BouncingCritter'
import Vector from '../../../src/models/Vector'

let ins = null;

const worldMap = [
  '############################',
  '#      #    #      o      ##',
  '#                          #',
  '#          #####           #',
  '##         #   #    ##     #',
  '###           ##     #     #',
  '#           ###      #     #',
  '#   ####                   #',
  '#   ##       o             #',
  '# o  #         o       ### #',
  '#    #                     #',
  '############################'
]

const legend = {
  '#': Wall,
  'o': BouncingCritter,
  ' ': Space,
}

describe('class World', () => {
  describe('#constructor(worldMap, legend)', () => {
    it('should normal new a instance', () => {
      ins = new World(worldMap, legend)

      expect(ins.grid.width).to.be.equal(worldMap[0].length)
      expect(ins.grid.height).to.be.equal(worldMap.length)
    })
  })

  describe('#getStateMap()', () => {
    it('should return world state string', () => {
      expect(ins.getStateMap()).to.be.equal(worldMap.join('\n') + '\n')
    })
  })

  describe('#getValidDesctination', () => {
    it('should return undefined when action.direction is invalid', () => {
      let rslt = ins.getValidDesctination({direction: 'hehe'})
      expect(rslt).to.be.equal(undefined)
    })

    it('should return undefined when dest is outside', () => {
      let rslt = ins.getValidDesctination({direction: 'n'}, new Vector(0, 0))
      expect(rslt).to.be.equal(undefined)
    })

    it('should return valid dest', () => {
      let rslt = ins.getValidDesctination({direction: 'e'}, new Vector(1, 1))
      expect(rslt.x == 2 && rslt.y == 1).to.be.ok
    })
  })

  describe('#letAct', () => {
    it('shoudl return undefined when element.act return null', () => {
      let el = {
        act: () => null
      }
      let rslt = ins.letAct(el)
      expect(rslt).to.be.equal(undefined)
    })

    // TDDO: 不知道要如何去mock getValidDesctination的行为，然后reset
    it('should return undefined when getValidDesctination return null', () => {
    })
  })
})
