import Utils from '../common/utils'

class View {
  constructor (world, vector) {
    this.world = world
    this.vector = vector
  }

  look (directionName) {
    let targetVector = this.vector.plus(Utils.directions[directionName])
    if (!this.world.grid.isInside(targetVector)) {
      return '#'
    }

    return this.world.grid.get(targetVector).legendChar
  }

  find (target) {
    let targetDirections = this.findAll(target)

    if (targetDirections.length) {
      return Utils.randomElements(targetDirections)
    } else {
      return null
    }
  }

  findAll (target) {
    let targetDirections = []
    for (let direction in Utils.directions) {
      if (this.look(direction) == target) {
        targetDirections.push(direction)
      }
    }

    return targetDirections
  }
}

export default View
