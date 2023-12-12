import Utils from "../Utils.js";
import JW_Utils from "../JW_Utils.js";

class Drone
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

    this.r = 10;
    this.m = 1;
    this.v = {x: 0, y: 0};
    this.pos = {x: this.pos_start.x, y: this.pos_start.y};
  }

  Get_Pos()
  {
    return this.pos;
  }

  Render(ctx)
  {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.ellipse(0, 0, this.r, this.r, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  On_Process(millis, game)
  {
    const elapsed_millis = JW_Utils.Elapsed_Millis(this, millis);

    let g = JW_Utils.Vec_Gravity(1, this.m, this.pos, this.pos_end);

    const explosions = game.objs.filter(o => o.constructor.name == "Patriot_Explosion");
    for (const explosion of explosions)
    {
      const ef = JW_Utils.Vec_Gravity(1, -0.1, this.pos, explosion.Get_Pos());
      g = JW_Utils.Vec_Add(g, ef);
    }

    const d = elapsed_millis * 0.05;
    const vd = Vec_X(g, d);
    this.pos = JW_Utils.Vec_Add(this.pos, vd);

    if (JW_Utils.Close(this.pos, this.pos_end, 5))
    {
      game.Obj_Remove(this);

      const explosion = new this.obj_types.Explosion(this.pos);
      game.Obj_Add(explosion);
    }
  }
}

export default Drone;

function Vec_X(vec, s)
{
  const n = JW_Utils.Vec_Norm(vec);
  const r = JW_Utils.Vec_Mul(n, s);
  return r;
}
