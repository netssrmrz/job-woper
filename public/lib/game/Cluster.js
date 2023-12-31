import Utils from "../Utils.js";
import JW_Utils from "../JW_Utils.js";

class Cluster
{
  constructor(obj_types)
  {
    this.obj_types = obj_types;
    
    const polar_pos = 
    {
      r: Utils.Random(900, 1000),
      a: Utils.Random(-Math.PI,Math.PI)
    };
    this.pos_start = JW_Utils.Polar_To_Cart(polar_pos);
    
    this.pos_end = 
    {
      x: Utils.Random(-100, 100), 
      y: Utils.Random(-100, 100)
    };
    
    this.t = 0;
    this.duration_millis = 40000;

    this.r = 3;
  }

  Calc_Pos(p1, p2, t)
  {
    const pos =
    {
      x: t * (p2.x - p1.x) + p1.x,
      y: t * (p2.y - p1.y) + p1.y,
    }

    return pos;
  }

  Get_Pos()
  {
    return this.Calc_Pos(this.pos_start, this.pos_end, this.t);
  }

  Render(ctx)
  {
    ctx.strokeStyle = "#f00";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.ellipse(0, 0, this.r, this.r, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  On_Process(millis, game)
  {
    this.t = JW_Utils.Millis_To_T(this, millis);
    if (this.t > 0.5)
    {
        game.Obj_Remove(this);

        let icbm = new this.obj_types.ICBM(this.obj_types, this.Get_Pos());
        game.Obj_Add(icbm);
        icbm = new this.obj_types.ICBM(this.obj_types, this.Get_Pos());
        game.Obj_Add(icbm);
        icbm = new this.obj_types.ICBM(this.obj_types, this.Get_Pos());
        game.Obj_Add(icbm);
    }
  }
}

export default Cluster;