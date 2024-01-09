import Utils from "../Utils.js";
import JW_Utils from "../JW_Utils.js";

class Enemy
{
  constructor(obj_types, weapons, missile_count, launch_millis)
  {
    this.obj_types = obj_types;
    this.weapons = weapons;
    this.missile_count = missile_count;
    this.launch_time = 0;
    this.launch_millis = launch_millis;
  }

  On_Process(millis, game)
  {
    if (this.missile_count > 0)
    {
      if (millis > this.launch_time)
      {
        const weapon_def = Choose_Weapon(this.weapons);
        const weapon_class = weapon_def.class_obj;
        const weapon = new weapon_class(this.obj_types);
        game.Obj_Add(weapon);
        this.missile_count--;
        this.launch_time = millis + this.launch_millis;
      }
    }
    else
    {
      game.Check_End();
    }
  }
}

export default Enemy;

function Choose_Weapon(weapons)
{
  let res = null;
  let prob_a = 0;

  const prob = Math.random();
  for (const weapon of weapons)
  {
    const prob_b = prob_a + weapon.prob;
    if (prob >= prob_a && prob < prob_b)
    {
      res = weapon;
      break;
    }
    prob_a = prob_b;
  }

  return res;
}
