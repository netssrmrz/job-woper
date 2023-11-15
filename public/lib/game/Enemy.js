import Utils from "../Utils.js";
import JW_Utils from "../JW_Utils.js";

class Enemy
{
  constructor(obj_types)
  {
    this.obj_types = obj_types;
  }

  Process(millis, game)
  {
    const launch_icbm = Math.random() > 0.996;
    if (launch_icbm)
    {
      game.Obj_Add(new this.obj_types.ICBM(this.obj_types.Explosion));
    }
  }
}

export default Enemy;