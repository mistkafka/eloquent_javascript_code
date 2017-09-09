class BaseElement {
  constructor (legendChar) {
    if (!legendChar) {
      throw new Error('legendChar is required!')
    }
    Reflect.defineProperty(this, 'legendChar', {
      value: legendChar,
      writable: false
    })
  }
}

export default BaseElement
