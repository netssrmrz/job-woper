import Utils from "../Utils.js";
import JW_Utils from "../JW_Utils.js";

import ICBM from "/lib/game/ICBM.js";
import Explosion from "/lib/game/Explosion.js";
import Cluster from "/lib/game/Cluster.js";
import Cruise from "/lib/game/Cruise.js";
import Drone from "/lib/game/Drone.js";
import Score from "/lib/game/Score.js";
import Patriot from "/lib/game/Patriot.js";
import Patriot_Explosion from "/lib/game/Patriot_Explosion.js";

import City from "/lib/game/City.js";
import Enemy from "/lib/game/Enemy.js";
import Enemy2 from "/lib/game/Enemy2.js";
import Enemy3 from "/lib/game/Enemy3.js";
import Enemy4 from "/lib/game/Enemy4.js";
import Player from "/lib/game/Player.js";

const game_classes = 
{
  ICBM, Explosion, Cluster, Cruise, Drone,
  Score, Patriot, Patriot_Explosion
};

const level0_def =
[
  {
    class_obj: ICBM,
    prob: 0,
    speed: 0.04
  }  
];
const level1_def =
[
  {
    class_obj: ICBM,
    prob: 0,
    speed: 0.08
  }  
];
const level2_def =
[
  {
    class_obj: ICBM,
    prob: 0,
    speed: 0.08
  },
  {
    class_obj: Cluster,
    prob: 0.6,
    speed: 0.08
  }  
];

const level =
[
  [
    new City(170,140),
    new City(-140,140),
    new City(-150,-170),
    new City(150,-100),
    new City(0, 0),
    new Enemy(game_classes, level0_def, 10),
    new Player(game_classes),
  ],
  [
    new City(170,140),
    new City(-140,140),
    new City(-150,-170),
    new City(150,-100),
    new City(0, 0),
    new Enemy(game_classes, level1_def, 15),
    new Player(game_classes),
  ],
  [
    new City(170,140),
    new City(-140,140),
    new City(-150,-170),
    new City(150,-100),
    new City(0, 0),
    new Enemy(game_classes, level2_def, 15),
    new Player(game_classes),
  ],
  [
    new City(170,140),
    new City(-140,140),
    new City(-150,-170),
    new City(150,-100),
    new City(0, 0),
    new Enemy2(game_classes),
    new Player(game_classes),
  ],
  [
    new City(170,140),
    new City(-140,140),
    new City(-150,-170),
    new City(150,-100),
    new City(0, 0),
    new Enemy3(game_classes),
    new Player(game_classes),
  ],
  [
    new City(170,140),
    new City(-140,140),
    new City(-150,-170),
    new City(150,-100),
    new City(0, 0),
    new Enemy4(game_classes),
    new Player(game_classes),
  ],
];

export default level;
