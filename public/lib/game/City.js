
class City
{
  constructor(x, y)
  {
    this.scale = {x: 1, y: 1};
    this.pos = {x, y};
    this.r = 20;
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
    ctx.strokeStyle = "#0ff";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(-20, 20);
    ctx.lineTo(20, 20);
    ctx.lineTo(20, 0);
    ctx.lineTo(15, 0);
    ctx.lineTo(15, -20);
    ctx.lineTo(10, -20);
    ctx.lineTo(10, 5);
    ctx.lineTo(5, 5);
    ctx.quadraticCurveTo(0, 0, 0, -15);
    ctx.lineTo(5, -15);
    ctx.quadraticCurveTo(0, -20, -5, -15);
    ctx.lineTo(0, -15);
    ctx.quadraticCurveTo(0, 5, -5, 5);
    ctx.lineTo(-5, -5);
    ctx.lineTo(-10, -5);
    ctx.lineTo(-10, -10);
    ctx.lineTo(-15, -10);
    ctx.lineTo(-15, 10);
    ctx.lineTo(-20, 10);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, this.r, this.r, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export default City;