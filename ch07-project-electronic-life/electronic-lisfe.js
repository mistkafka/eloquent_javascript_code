const World = require('./world');
const Wall = require('./wall');
const BouncingCritter = require('./bouncingcritter');
const WallFollower = require('./wall-follower');
const LifeLikeWorld = require('./life-like-world');
const Plant = require('./plant');
const PlantEater = require('./plant-eater');
const Predator = require('./predator');

const PLAN = ["############################",
              "#      #    #      o      ##",
              "#    x                     #",
              "#          #####           #",
              "##         #   #    ##     #",
              "###           ##     #     #",
              "#           ###      #     #",
              "#   ####x                  #",
              "#   ##       o             #",
              "# o  #         o       ### #",
              "#    #                     #",
              "############################"];

let world = new World(PLAN, {'#': Wall, 'o': BouncingCritter, 'x': WallFollower});
let valley = new LifeLikeWorld(
  ["############################",
   "#####                 ######",
   "##   ***                **##",
   "#   *##**         **  O  *##",
   "#    ***     O    ##**    *#",
   "#       O*        ##***    #",
   "#   *   *         ##**     #",
   "#   O  **   #*             #",
   "#*          #**       O    #",
   "#***        ##**    O    **#",
   "##****O    ###***       *###",
   "############################"],
  {
    '#': Wall,
    'O': PlantEater,
    '*': Plant
  }
);

let valley2 = new LifeLikeWorld(
  ['######################################################################',
   '#                 **********                                         #',
   '######### OO      ****** *OOOO        OO     OOO   X      OO         #',
   '#  ####                                                              #',
   '#                                             *******                #',
   '#******                                                        **    #',
   '#***       OOOOOOOOO                                         **      #',
   '#**         X               **** *                OOOOO   **    *    #',
   '#                            ****  *                           O     #',
   '#              ***             OOOOO    OOOOOO       **  ** O        #',
   '#          *** O      ******            X                 **         #',
   '######################################################################'],
  {
    '#': Wall,
    '*': Plant,
    'O': PlantEater,
    'X': Predator
  }
);

for (let i = 0; i < 1000; i++) {
  valley2.turn();
  console.log(valley2.toString());
}
