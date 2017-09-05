import { expect } from 'chai'
import World from '../../../src/models/World'
import Wall from '../../../src/models/Wall'
import Space from '../../../src/models/Space'
import BouncingCritter from '../../../src/models/BouncingCritter'

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

  describe('getStateMap()', () => {
    it('should return world state string', () => {
      expect(ins.getStateMap()).to.be.equal(worldMap.join('\n') + '\n')
    })
  })
})
