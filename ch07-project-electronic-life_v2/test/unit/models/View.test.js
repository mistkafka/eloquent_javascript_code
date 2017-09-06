/**
  * 我尝试用testdoublejs来Fake下面这个恶心的单元测试，但是我失败了。
  *
  * 先说现成的测试为什么恶心。我们为了测试View下的look(), find(), findAll()的逻辑需要
  * 构造出一整个World来，要精心的去写各个case下view所在的vector。我觉得的这个过程很让人
  * 难受，而且很不可读。
  *
  * 所以，我尝试使用Mock/Fake的方式去写这三个方法的单元测试。比如，look()方法我需要测试的是：
  * 1) targetVector有没有正确计算出来？2) this.world.grid.isInside返回false的时候需要返
  * 回'#'。其余的，isInside是否work？World如何构建？grid的get()能否正常返回？ 这些在View
  * 的单元测试里，我不愿意关心。
  *
  * 然后，现实是这个模块很难Fake/Mock。很难！
  * 1) 我要Fake World
  * 2) 我要Fake World里面的grid（因为View#look()依赖了this.world.grid）
  * 3) 因为Vector#plus是返回一个新对象的，所以我还要Fake Vector，不然没有办法比较targetVe-
  * ctor是不是我们要的。（如果可以比较的话，就能使用td.when(world.grid.isInside({x: 0, y:
  * 1})).thenReturn(true)来确定targetVector被计算正确了。)
  * 啊！Fuck！这还不如现有的测试代码来得舒服。
  *
  * 这是由什么导致的呢？我想了下，大概有这两点:
  * 1) View.js这个类的依赖实在太TM多了！
  * 2) testdouble.js的能力有限，没有办法比较两个对象。
  * 压死骆驼的最后一根稻草就是那个两个vector无法比较，关于这一点，我不清楚该“怪罪”谁。虽然我怪罪
  * 了testdoublejs能力不足，但是似乎是在强行甩锅。
  */
import { expect } from 'chai'
import View from '../../../src/models/View'
import World from '../../../src/models/World'
import Vector from '../../../src/models/Vector'
import Wall from '../../../src/models/Wall'
import Space from '../../../src/models/Space'
import BouncingCritter from '../../../src/models/BouncingCritter'

const worldMap = [
  '########',
  '# o o ##',
  '########',
]

const legend = {
  '#': Wall,
  'o': BouncingCritter,
  ' ': Space,
}

let world = new World(worldMap, legend)

let ins1 = new View(world, new Vector(1, 1))
let ins2 = new View(world, new Vector(0, 0))
let ins3 = new View(world, new Vector(3, 1))

describe('class View', () => {
  describe('#look(directionName)', () => {
    it('should basic work', () => {
      expect(ins1.look('e')).to.be.equal('o')
    })

    it('should return "#" when look outside world', () => {
      expect(ins2.look('w')).to.be.equal('#')
    })
  })

  describe('#find(target)', () => {
    it('should return a direction name when target is exists', () => {
      expect(typeof ins1.find('#')).to.be.equal('string')
    })

    it('should return null when target is not exists', () => {
      expect(ins2.find('o')).to.be.equal(null)
    })
  })

  describe('#findAll(target)', () => {
    it('basic work', () => {
      let directions = ins3.findAll('o')

      expect(directions.length).to.be.equal(2)
      expect(directions.includes('e')).to.be.ok
      expect(directions.includes('w')).to.be.ok
    })
  })
})
