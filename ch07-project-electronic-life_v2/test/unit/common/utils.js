import { expect } from 'chai'
import Utils from '../../../src/common/utils'


describe('Utils', () => {
  describe('#randomDirection()', () => {
    it('should return a direction name', () => {
      let directionName = Utils.randomDirection()

      expect(Utils.directionNames.includes(directionName)).to.be.ok
    })
  })
})
