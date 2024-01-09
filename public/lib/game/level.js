import Utils from "../Utils.js";
import JW_Utils from "../JW_Utils.js";

import ICBM from "/lib/game/ICBM.js";
import ICBM_M from "/lib/game/ICBM_M.js";
import ICBM_F from "/lib/game/ICBM_F.js";
import Cluster from "/lib/game/Cluster.js";
import Cruise from "/lib/game/Cruise.js";
import Drone from "/lib/game/Drone.js";
import Explosion from "/lib/game/Explosion.js";
import Score from "/lib/game/Score.js";
import Patriot from "/lib/game/Patriot.js";
import Patriot_Explosion from "/lib/game/Patriot_Explosion.js";

import City from "/lib/game/City.js";
import Enemy from "/lib/game/Enemy.js";
import Player from "/lib/game/Player.js";

const game_classes = 
{
  ICBM, ICBM_M, ICBM_F, Explosion, Cluster, Cruise, Drone,
  Score, Patriot, Patriot_Explosion
};

const level0_def =
[
  //{ class_obj: ICBM, prob: 1 }  
  { class_obj: Cluster, prob: 1 }  
];
const level1_def =
[
  { class_obj: ICBM_M, prob: 1 }  
];
const level2_def =
[
  { class_obj: ICBM_F, prob: 1 }
];
const level3_def =
[
  { class_obj: ICBM_M, prob: 0.5 },
  { class_obj: Cluster, prob: 0.5 },
];
const level4_def =
[
  { class_obj: ICBM_M, prob: 0.5 },
  { class_obj: Cruise, prob: 0.5 },
];
const level5_def =
[
  { class_obj: ICBM_M, prob: 0.5 },
  { class_obj: Drone, prob: 0.5 },
];

const level =
[
  [
    new City(170,140),
    new City(-140,140),
    new City(-150,-170),
    new City(150,-100),
    new City(0, 0),
    new Enemy(game_classes, level0_def, 10, 2000),
    new Player(game_classes),
  ],
  [
    new City(170,140),
    new City(-140,140),
    new City(-150,-170),
    new City(150,-100),
    new City(0, 0),
    new Enemy(game_classes, level1_def, 15, 1500),
    new Player(game_classes),
  ],
  [
    new City(170,140),
    new City(-140,140),
    new City(-150,-170),
    new City(150,-100),
    new City(0, 0),
    new Enemy(game_classes, level2_def, 20, 1000),
    new Player(game_classes),
  ],
  [
    new City(170,140),
    new City(-140,140),
    new City(-150,-170),
    new City(150,-100),
    new City(0, 0),
    new Enemy(game_classes, level3_def, 20, 2000),
    new Player(game_classes),
  ],
  [
    new City(170,140),
    new City(-140,140),
    new City(-150,-170),
    new City(150,-100),
    new City(0, 0),
    new Enemy(game_classes, level4_def, 20, 2000),
    new Player(game_classes),
  ],
  [
    new City(170,140),
    new City(-140,140),
    new City(-150,-170),
    new City(150,-100),
    new City(0, 0),
    new Enemy(game_classes, level5_def, 20, 2000),
    new Player(game_classes),
  ],
];

export default level;
