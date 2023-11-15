import Utils from "../Utils.js";
import JW_Utils from "../JW_Utils.js";

class ICBM
{
  constructor(Explosion)
  {
    this.Explosion = Explosion;
    
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
    
    this.pos = {x: this.pos_start.x, y: this.pos_start.y};

    this.speed = 0.04;
    const vd = JW_Utils.Vec_Sub(this.pos_end, this.pos);
    const v2 = JW_Utils.Vec_Norm(vd);
    const v3 = JW_Utils.Vec_Rev(v2);
    this.vel = JW_Utils.Vec_Mul(v3, this.speed);

    const polar_vel = JW_Utils.Cart_To_Polar(this.vel);
    this.angle = polar_vel.a;

    const d = Math.hypot(vd.x, vd.y);
    this.duration_millis = d / this.speed;

    this.r = 10;
  }

  Get_Pos()
  {
    return this.pos;
  }

  Get_Angle()
  {
    return this.angle;
  }

  Get_Scale()
  {
    return {x: 1, y: 1};
  }

  Render(ctx)
  {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(10, 0);
    ctx.lineTo(-5, -5);
    ctx.lineTo(-5, 5);
    ctx.lineTo(10, 0);

    const d = JW_Utils.Distance(this.pos_start, this.pos);
    ctx.moveTo(-5, 0);
    ctx.lineTo(-d, 0);

    ctx.stroke();
  }

  Process(millis, game)
  {
    if (this.last_millis)
    {
      const elapsed_millis = millis - this.last_millis;
      this.pos.x += this.vel.x * elapsed_millis;
      this.pos.y += this.vel.y * elapsed_millis;
    }
    this.last_millis = millis;

    const t = JW_Utils.Millis_To_T(this, millis);
    if (t > 1)
    {
      game.Obj_Remove(this);

      const explosion = new this.Explosion(this.pos);
      game.Obj_Add(explosion);
    }
  }
}

export default ICBM;