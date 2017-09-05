import BaseElement from '../../../src/models/BaseElement'
import { expect } from 'chai'

let ins = new BaseElement('#')

describe('class BaseElement', () => {
  describe('#constructor (legendChar)', () => {
    it('legendChar should be readonly', () => {

      expect(ins.legendChar).to.be.equal('#')
      try {
        ins.legendChar = '*'
      } catch (e) {
          // normal, it's readonly
      }
      expect(ins.legendChar).to.be.equal('#')
    })
  })
})
