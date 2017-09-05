const _width = Symbol('width')
const _height = Symbol('height')
const _spaces = Symbol('spaces')

class Grid {
  constructor (width, height) {
    this[_width] = width
    this[_height] = height
    this[_spaces] = new Array(width * height)
  }

  get width () {
    return this[_width]
  }

  get height () {
    return this[_height]
  }

  isInside (vector) {
    return vector.x >= 0 && vector.x < this[_width] &&
      vector.y >= 0 && vector.y < this[_height]
  }

  get (vector) {
    let index = vector.x + this[_width] * vector.y;
    return this[_spaces][index]
  }

  set (vector, value) {
    let index = vector.x + this[_width] * vector.y
    this[_spaces][index] = value
  }

  get [Symbol.toStringTag] () {
    return `class Grid(width=${this[_width]}, height=${this[_height]})`
  }
}

export default Grid
