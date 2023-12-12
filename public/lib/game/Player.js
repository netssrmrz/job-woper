import Utils from "../Utils.js";
import JW_Utils from "../JW_Utils.js";

class Player
{
  constructor(obj_types)
  {
    this.obj_types = obj_types;
    this.score = 0;
  }

  xProcess(millis, game)
  {
  }

  Fire(pos, game)
  {
    game.Obj_Add(new this.obj_types.Patriot(pos, this.obj_types.Patriot_Explosion));
  }

  Add_Score(score, game)
  {
    this.score += score;
    game.Obj_Add(new this.obj_types.Score(score));
  }
}

export default Player;