import Utils from "../Utils.js";
import JW_Utils from "../JW_Utils.js";

class Patriot_Explosion
{
  constructor(pos)
  {
    this.pos = pos;
    this.scale = {x: 0, y: 0};
    this.duration_millis = 3000;
    this.r = 50;
  }

  Get_Pos()
  {
    return this.pos;
  }

  Get_Scale()
  {
    return this.scale;
  }

  Render(ctx)
  {
    ctx.fillStyle = "#fff";

    ctx.beginPath();
    ctx.ellipse(0, 0, this.r, this.r, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  Process(millis, game)
  {
    const t = JW_Utils.Millis_To_T(this, millis);
    if (t > 1)
    {
      game.Obj_Remove(this);
    }
    else
    {
      this.scale = {x: t, y: t};
      
      const icbm = JW_Utils.Collision(game, this, "ICBM");
      if (icbm)
      {
        game.Obj_Remove(icbm);
      }
    }
  }
}

export default Patriot_Explosion;