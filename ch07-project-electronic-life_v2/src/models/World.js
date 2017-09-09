import Utils from '../common/utils'
import Grid from './Grid'
import Vector from './Vector'
import View from './View'
import Space from './Space'

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

  turn () {
    let actedEls = []
    for (let {el, vector} of this.grid) {
      if (!el.act) {
        continue
      }

      if (actedEls.includes(el)) {
        continue
      }

      actedEls.push(el)
      this.letAct(el, vector)
    }
  }

  letAct (el, vector) {
    let action = el.act(new View(this, vector))
    if (!action) {
      return
    }

    switch (action.type) {
      case 'move':
        let dest = this.getValidDesctination(action, vector)
        if (!dest) {
          return
        }
        if (!(this.grid.get(dest) instanceof Space)) {
          return
        }
        this.grid.set(vector, new Space(' '))
        this.grid.set(dest, el)
        break
    }
  }

  getValidDesctination (action, vector) {
    if (!Utils.directionNames.includes(action.direction)) {
      return
    }

    let dest = vector.plus(Utils.directions[action.direction])
    if (!this.grid.isInside(dest)) {
      return
    }

    return dest
  }
}

export default World
