import Utils from "../Utils.js";
import JW_Utils from "../JW_Utils.js";

class Enemy
{
  constructor(obj_types, weapons, missiles)
  {
    this.obj_types = obj_types;
    this.weapons = weapons;
    this.missiles = missiles;
  }

  Process(millis, game)
  {
    if (this.missiles > 0)
    {
      const launch_icbm = Math.random() > 0.996;
      if (launch_icbm)
      {
        const weapon_def = Choose_Weapon(this.weapons);
        const weapon_class = weapon_def.class_obj;
        const weapon = new weapon_class(this.obj_types);
        if (weapon.Set_Speed)
        {
          weapon.Set_Speed(weapon_def.speed);
        }
        game.Obj_Add(weapon);
        this.missiles--;
      }
    }
    else
    {
      const objs_exist = game.Obj_Exists(["ICBM", "Explosion", "Patriot_Explosion"]);
      if (!objs_exist)
      {
        game.dispatchEvent(new Event("end"));
      }
    }
  }
}

export default Enemy;

function Choose_Weapon(weapons)
{
  let res = null;

  const prob = Math.random();
  for (let i=0; i<weapons.length; i++)
  {
    const weapon = weapons[i];
    const prob_a = weapon.prob;
    const prob_b = i < weapons.length-1 ? weapons[i+1].prob : 1;
    if (prob >= prob_a && prob < prob_b)
    {
      res = weapon;
      break;
    }
  }

  return res;
}
