import { expect } from 'chai'
import Vector from '../../../src/models/Vector'

describe('class Vector', () => {
  describe('# constructor(x, y)', () => {
    it('should normal get instance', () => {
      let v = new Vector(1, 2)

      expect(v.x).to.be.equal(1)
      expect(v.y).to.be.equal(2)
    })
  })

  describe('# plus', () => {
    it('should plus basic work and can\'t change origin value', () => {
      let v1 = new Vector(1, 2)
      let v2 = new Vector(-3, 2)

      let rslt = v1.plus(v2)

      expect(rslt.x).to.be.equal(-2)
      expect(rslt.y).to.be.equal(4)

      expect(rslt).to.be.not.equal(v1)
      expect(rslt).to.be.not.equal(v2)
    })
  })
})
