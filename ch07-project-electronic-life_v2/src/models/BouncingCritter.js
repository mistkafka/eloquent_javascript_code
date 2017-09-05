import Utils from '../common/utils'
import BaseElement from './BaseElement'

class BouncingCritter extends BaseElement {
  constructor (legendChar) {
    super(legendChar)

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
