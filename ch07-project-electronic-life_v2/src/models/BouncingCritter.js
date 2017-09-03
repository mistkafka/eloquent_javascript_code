import Utils from '../common/utils'

class BouncingCritter {
  constructor () {
    this.direction = Utils.randomDirection()
  }

  act (view) {
    if (view.look(this.direction) != " ") {
      this.direction = view.find(' ') || 's'
    }

    return {
      type: 'move',
      direction: this.direction,
    }
  }
}

export default BouncingCritter
