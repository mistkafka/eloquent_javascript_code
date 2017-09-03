import BouncingCritter from '../../../src/models/BouncingCritter'
import Utils from '../../../src/common/utils'
import { expect } from 'chai'

describe('class BouncingCritter', () => {
  describe('#constructor', () => {
    it('should get a init direction', () => {
      let ins = new BouncingCritter()

      expect(Utils.directionNames.includes(ins.direction)).to.be.ok
    })
  })

  // TODO:
  describe('#act', () => {
  })
})
