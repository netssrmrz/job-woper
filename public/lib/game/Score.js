import Utils from "../Utils.js";
import JW_Utils from "../JW_Utils.js";

class Score
{
  constructor(score)
  {
    this.scale = {x: 0, y: 0};
    this.duration_millis = 1000;
    this.angle = 0;
    this.score = score;
    this.t = 0;
  }

  Get_Pos()
  {
    return {x: 0, y: 0};
  }

  Get_Angle()
  {
    return this.angle;
  }

  Get_Scale()
  {
    return this.scale;
  }

  On_Process(millis, game)
  {
    this.t = JW_Utils.Millis_To_T(this, millis);
    if (this.t > 1)
    {
      game.Obj_Remove(this);
    }
    else
    {
      this.scale = {x: this.t*50, y: this.t*50};
      this.angle += 0.05;
    }
  }

  Render(ctx)
  {
    ctx.lineWidth = 1;
    ctx.font = "normal 10px hyperspace-bold";

    const alpha = Math.trunc((1 - this.t) * 255);
    let alpha_hex = alpha.toString(16);
    if (alpha_hex.length == 1)
      alpha_hex = "0" + alpha_hex;
    ctx.fillStyle = "#00ff00" + alpha_hex;

    const str = "+"+this.score;
    const measure = ctx.measureText(str);
    ctx.fillText(str, -measure.width/2, 5);
  }
}

export default Score;