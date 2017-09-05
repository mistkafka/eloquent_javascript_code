import Wall from '../../../src/models/Wall'
import { expect } from 'chai'

let ins = new Wall('#')

describe('class Wall', () => {
  describe('#constructor (legendChar)', () => {
    it('should call super(legendChar)', () => {

      expect(ins.legendChar).to.be.equal('#')
    })
  })
})
