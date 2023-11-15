import Utils from "./Utils.js";
import config from "./config.js";

class JW_Utils
{
  static FB_USER_ID = "jw_fb_user";

  static Update_Access()
  {
    JW_Utils.Set_Timeouts();
    document.addEventListener("mousemove", JW_Utils.On_Mouse_Move);
  }

  static Set_Timeouts()
  {
    if (document.token_timeout)
    {
      clearTimeout(document.token_timeout);
    }

    const user = JW_Utils.Get_User();
    if (user)
    {
      const exp_time = user.stsTokenManager.expirationTime;
      console.log("JW_Utils.Set_Timeouts(): exp time =", new Date(exp_time));

      const now = Date.now();
      if (exp_time > now)
      {
        console.log("JW_Utils.Set_Timeouts(): token has not expired");

        const token_timeout_millis = exp_time - now;
        document.token_timeout = setTimeout(JW_Utils.On_Timeout, token_timeout_millis);
      }
      else
      {
        console.log("JW_Utils.Set_Timeouts(): token has expired");

        window.open("/index.html", "_top");
      }
    }
  }

  /**
   * Indicates whether a user is logged in or not.
   * @static
   * @returns {boolean}
   */
  static Is_Logged_In()
  {
    let res = false;

    const user = JW_Utils.Get_User();
    if (user)
    {
      const exp_time = user.stsTokenManager.expirationTime;
      const now = Date.now();
      res = exp_time > now;
    }

    return res;
  }

  static async Refresh_Token()
  {
    const user = JW_Utils.Get_User();
    const new_user = await Admin.Refresh_Token(user);
    if (new_user)
    {
      JW_Utils.Set_User(new_user);
      JW_Utils.Set_Timeouts();
    }
  }

  static On_Mouse_Move()
  {
    document.last_activity_time = Date.now();
    //console.log("JW_Utils.On_Mouse_Move()");
  }

  static On_Timeout()
  {
    const millis_since_last_activity = Date.now() - document.last_activity_time;
    const mins_since_last_activity = millis_since_last_activity / Utils.MILLIS_MINUTE;
    if (mins_since_last_activity < 5)
    {
      console.log("JW_Utils.On_Timeout(): activity detected and token refreshed");
      JW_Utils.Refresh_Token();
    }
    else
    {
      console.log("JW_Utils.On_Timeout(): no activity detected so login required");
      window.open("/index.html", "_top");
    }
  }

  static async Import_API()
  {
    const user = JW_Utils.Get_User();
    const token = user?.stsTokenManager?.accessToken;
    await Utils.Import_API(config.get(), null, null, token, JW_Utils.On_Error);
  }

  static Get_User()
  {
    return Utils.Get_From_Storage_JSON(localStorage, JW_Utils.FB_USER_ID, null);
  }

  static Set_User(user)
  {
    if (user)
    {
      Utils.setLocalStorgeJson(JW_Utils.FB_USER_ID, user);
    }
    else
    {
      localStorage.removeItem(JW_Utils.FB_USER_ID);
    }
  }

  static On_Error(url, options, http_json)
  {
    if (http_json.error.stack)
    {
      console.error(http_json.error.stack);
    }
    else
    {
      console.error(http_json.error.code + ": " + http_json.error.message);
    }
    
    if (http_json.error.code == "RPC_ERROR_NO_AUTH")
    {
      window.open("/index.html", "_top");
    }
  }

  static Set_Text(elem, text)
  {
    elem.classList.remove("wait");
    elem.classList.remove("error");
    elem.classList.remove("has-data");

    if (text == undefined)
    {
      elem.classList.add("error");
      elem.innerText = null;
    }
    else
    {
      elem.classList.add("has-data");
      elem.innerText = text;
    }
  }

  static Hide(elem)
  {
    if (JW_Utils.Is_Visible(elem))
    {
      elem.prev_style_display = elem.style.display;
      elem.style.display = "none";
    }
  }

  static Show(elem)
  {
    if (!JW_Utils.Is_Visible(elem))
    {
      if (elem.prev_style_display != null && elem.prev_style_display != "none")
      {
        elem.style.display = elem.prev_style_display;
      }
      else
      {
        elem.style.display = "block";
      }
    }
  }

  static Is_Visible(elem)
  {
    let res = true;

    if (elem)
    {
      const style_display = window.getComputedStyle(elem).display;
      if (style_display == undefined || style_display == null || style_display == "" || style_display == "none")
      {
        res = false;
      }
    } 

    return res;
  }

  static Clr(elem)
  {
    while (elem.firstChild) 
    {
      elem.removeChild(elem.firstChild);
    }
  }

  static To_Precision(val, precision)
  {
    const val_num = new Number(val);
    const res = val_num.toPrecision(precision);

    return res;
  }

  static Polar_To_Cart(pos)
  {
    return {
      x: pos.r * Math.cos(pos.a),
      y: pos.r * Math.sin(pos.a)
    };
  }

  static Cart_To_Polar(pos)
  {
    return {
      r: Math.hypot(pos.x, pos.y),
      a: Math.atan2(pos.y, pos.x)
    }
  }

  static Vec_Norm(vec)
  {
    const m = Math.hypot(vec.x, vec.y);
    return {
      x: vec.x / m,
      y: vec.y / m
    }
  }

  static Vec_Rev(vec)
  {
    return {
      x: -vec.x,
      y: -vec.y
    }
  }

  static Vec_Mul(vec, m)
  {
    return {
      x: vec.x * m,
      y: vec.y * m
    }
  }

  static Vec_Sub(v1, v2)
  {
    return {
      x: v2.x - v1.x,
      y: v2.y - v1.y
    }
  }
    
  static Millis_To_T(obj, millis)
  {
    let t = null;

    if (obj.start_millis)
    {
      const elapsed_millis = millis - obj.start_millis;
      t = elapsed_millis / obj.duration_millis;
    }
    else
    {
      obj.start_millis = millis;
      t = 0;
    }

    return t;
  }

  static Distance(pt1, pt2)
  {
    const ptd = JW_Utils.Vec_Sub(pt2, pt1);
    const d = Math.hypot(ptd.x, ptd.y);

    return d;
  }

  static Collision(game, obj, class_name)
  {
    const target_obj = game.objs.find
      (o => o.constructor.name == class_name && Has_Collision(o));
    function Has_Collision(target_obj)
    {
      const d = JW_Utils.Distance(obj.Get_Pos(), target_obj.Get_Pos());
      const obj_r = obj.r * obj.Get_Scale().x;
      const target_r = target_obj.r * target_obj.Get_Scale().x;

      return obj_r + target_r > d;
    }

    return target_obj;
  }

  static Elapsed_Millis(obj, millis)
  {
    let elapsed_millis = 0;

    if (obj.last_millis)
    {
      elapsed_millis = millis - obj.last_millis;
    }
    obj.last_millis = millis;

    return elapsed_millis;
  }
}

export default JW_Utils;
