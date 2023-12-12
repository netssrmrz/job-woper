import Utils from "../Utils.js";
import JW_Utils from "../JW_Utils.js";

class Player
{
  constructor(obj_types)
  {
    this.obj_types = obj_types;
    this.score = 0;
    this.r = 0;
  }

  On_Init(game)
  {
    const w = game.canvas.width;
    const h = game.canvas.height;
    this.r = Math.min(w, h)/2;
  }

  xProcess(millis, game)
  {
  }

  Render(ctx)
  {
    ctx.strokeStyle = "#f00";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.ellipse(0, 0, this.r, this.r, 0, 0, Math.PI * 2);
    ctx.stroke();
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