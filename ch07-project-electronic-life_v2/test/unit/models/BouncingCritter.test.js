import View from '../../../src/models/View'
import BouncingCritter from '../../../src/models/BouncingCritter'
import Utils from '../../../src/common/utils'
import { expect } from 'chai'
import td from 'testdouble'

let ins = new BouncingCritter('^')

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
      let FakeView = td.constructor(View)
      td.when(FakeView.prototype.look(ins.direction)).thenReturn('#')
      td.when(FakeView.prototype.find(' ')).thenReturn(null)

      let view = new FakeView('Whatever', 'Whatever')

      let oldDirection = ins.direction
      let actObj = ins.act(view)
      expect(actObj.type).to.be.equal('move')
      expect(actObj.direction).to.be.equal('s')
    })

    it('should return current direction when front is space', () => {
      let FakeView = td.constructor(View)
      td.when(FakeView.prototype.look(ins.direction)).thenReturn(' ')

      let view = new FakeView('Whatever', 'Whatever')

      let oldDirection = ins.direction
      let newDirection = ins.act(view).direction
      expect(newDirection).to.be.equal(oldDirection)
    })
  })
})
