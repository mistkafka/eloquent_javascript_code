import World from './models/World'

import Wall from './models/Wall'
import Space from './models/Space'
import BouncingCritter from './models/BouncingCritter'

const worldMap = [
  '############################',
  '#      #    #      o      ##',
  '#                          #',
  '#          #####           #',
  '##         #   #    ##     #',
  '###           ##     #     #',
  '#           ###      #     #',
  '#   ####                   #',
  '#   ##       o             #',
  '# o  #         o       ### #',
  '#    #                     #',
  '############################'
]

const legend = {
  '#': Wall,
  'o': BouncingCritter,
  ' ': Space
}

let ins = new World(worldMap, legend)

for (let i = 0; i < 25; i++) {
  ins.turn()
  console.log(ins.getStateMap())
}
