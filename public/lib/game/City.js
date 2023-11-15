
class City
{
  constructor(x, y)
  {
    this.scale = {x: 1, y: 1};
    this.pos = {x, y};
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
    ctx.strokeStyle = "#0ff";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.ellipse(0, 0, this.r, this.r, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export default City;