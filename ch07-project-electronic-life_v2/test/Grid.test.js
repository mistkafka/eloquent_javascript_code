import { expect } from 'chai'
import Grid from '../src/Grid'
import Vector from '../src/Vector'

describe('class Grid', () => {
  const width = 3
  const height = 4
  let grid = new Grid(width, height)

  describe('# constructor(width, height)', () => {
    it('should normal get instance', () => {
      expect(grid.width).to.be.equal(width)
      expect(grid.height).to.be.equal(height)
    })
  })

  describe('# toString()', () => {
    it('should toString() get instance info', () => {
      expect(grid.toString()).to.be.equal(`[object class Grid(width=${width}, height=${height})]`)
    })
  })

  describe('# isInside', () => {
    it('vector with negative should be outside', () => {
      let v = new Vector(-1, height - 1)
      expect(grid.isInside(v)).to.be.not.ok
    })

    it('vector(x, y) which x >= width or y <= height should be outside', () => {
      let v1 = new Vector(width, height - 1)
      expect(grid.isInside(v1)).to.be.not.ok

      let v2 = new Vector(width - 1, height)
      expect(grid.isInside(v2)).to.be.not.ok

      let v3 = new Vector(width, height)
      expect(grid.isInside(v3)).to.be.not.ok
    })

    it('vector(x, y) which x >=0 and x < width and y >=0 and y < height should be inside', () => {
      let v = new Vector(width - 1, height - 1)
      expect(grid.isInside(v)).to.be.ok
    })
  })

  describe('# set & get', () => {
    it('should basic work', () => {
      let v = new Vector(width - 1, height - 1)
      let value = 'X'

      expect(grid.get(v)).to.be.equal(undefined)
      grid.set(v, value)
      expect(grid.get(v)).to.be.equal(value)
    })
  })
})
