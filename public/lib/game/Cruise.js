import Utils from "../Utils.js";
import JW_Utils from "../JW_Utils.js";
import { Bezier } from "../bezierjs/bezier.js";

class Cruise
{
  constructor(obj_types)
  {
    this.obj_types = obj_types;
    
    let polar_pos = 
    {
      r: Utils.Random(700, 800),
      a: Utils.Random(-Math.PI,Math.PI)
    };
    this.pos_start = JW_Utils.Polar_To_Cart(polar_pos);
    
    this.pos_end = 
    {
      x: Utils.Random(-300, 300), 
      y: Utils.Random(-300, 300)
    };

    polar_pos = 
    {
      r: 800,
      a: Utils.Random(-Math.PI,Math.PI)
    };
    const ctrl4 = JW_Utils.Vec_Add(JW_Utils.Polar_To_Cart(polar_pos), this.pos_start);
    polar_pos = 
    {
      r: 800,
      a: Utils.Random(-Math.PI,Math.PI)
    };
    const ctrl5 = JW_Utils.Vec_Add(JW_Utils.Polar_To_Cart(polar_pos), this.pos_end);
    this.path = new Bezier(this.pos_start, ctrl4, ctrl5, this.pos_end);
    
    this.t = 0;
    this.duration_millis = 40000;

    this.r = 3;
  }

  Get_Pos()
  {
    return this.path.get(this.t);
  }

  Render(ctx)
  {
    ctx.strokeStyle = "#f00";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.ellipse(0, 0, this.r, this.r, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  Process(millis, game)
  {
    this.t = JW_Utils.Millis_To_T(this, millis);
    if (this.t > 1)
    {
      game.Obj_Remove(this);

      const explosion = new this.obj_types.Explosion(this.Get_Pos());
      game.Obj_Add(explosion);
    }
  }
}

export default Cruise;