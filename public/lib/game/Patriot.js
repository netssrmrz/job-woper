import Utils from "../Utils.js";
import JW_Utils from "../JW_Utils.js";

class Patriot
{
  constructor(pt, Explosion)
  {
    this.Explosion = Explosion;
    
    this.pos_end = pt;
    
    this.pos = {x: 0, y: 0};

    this.speed = 1;
    const vd = JW_Utils.Vec_Sub(this.pos_end, this.pos);
    const v2 = JW_Utils.Vec_Norm(vd);
    const v3 = JW_Utils.Vec_Rev(v2);
    this.vel = JW_Utils.Vec_Mul(v3, this.speed);

    const polar_vel = JW_Utils.Cart_To_Polar(this.vel);
    this.angle = polar_vel.a;

    const d = Math.hypot(vd.x, vd.y);
    this.duration_millis = d / this.speed;
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
    ctx.strokeStyle = "#ff0";
    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(10, 0);
    ctx.lineTo(-5, -5);
    ctx.lineTo(-5, 5);
    ctx.lineTo(10, 0);

    ctx.stroke();
  }

  On_Process(millis, game)
  {
    const elapsed_millis = JW_Utils.Elapsed_Millis(this, millis);
    this.pos.x += this.vel.x * elapsed_millis;
    this.pos.y += this.vel.y * elapsed_millis;

    const t = JW_Utils.Millis_To_T(this, millis);
    if (t > 1)
    {
      game.Obj_Remove(this);

      const explosion = new this.Explosion(this.pos);
      game.Obj_Add(explosion);
    }
  }
}

export default Patriot;