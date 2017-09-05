class BaseElement {
  constructor (legendChar) {
    Reflect.defineProperty(this, 'legendChar', {
      value: legendChar,
      writable: false
    })
  }
}

export default BaseElement
