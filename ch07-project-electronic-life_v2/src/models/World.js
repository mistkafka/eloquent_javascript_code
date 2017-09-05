import Utils from '../common/utils'
import Grid from './Grid'
import Vector from './Vector'

class World {
  constructor (worldMap, legend) {
    this.grid = new Grid(worldMap[0].length, worldMap.length)
    this.legend = legend

    worldMap.forEach((line, y) => {
      line.split('').forEach((ch, x) => {
        this.grid.set(new Vector(x, y), new legend[ch](ch))
      })
    })
  }

  getStateMap () {
    let stateMap = ''

    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        let element = this.grid.get(new Vector(x, y))
        stateMap += element.legendChar
      }
      stateMap += '\n'
    }
    return stateMap
  }
}

export default World
