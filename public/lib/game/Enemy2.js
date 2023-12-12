import Utils from "../Utils.js";
import JW_Utils from "../JW_Utils.js";

class Enemy
{
  constructor(obj_types)
  {
    this.obj_types = obj_types;
    this.missiles = 10;
  }

  On_Process(millis, game)
  {
    if (this.missiles > 0)
    {
      const launch_icbm = Math.random() > 0.996;
      if (launch_icbm)
      {
        game.Obj_Add(new this.obj_types.Cluster(this.obj_types));
        this.missiles--;
      }
    }
    else
    {
      game.Check_End();
    }
  }
}

export default Enemy;