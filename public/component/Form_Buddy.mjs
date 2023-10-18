import Utils from "../lib/Utils.js";

class Form_Buddy extends HTMLElement 
{
  static tname = "form-buddy";

  constructor()
  {
    super();
  }

  connectedCallback()
  {
    this.Render();
  }

  static observedAttributes = ["value", "name"];
  attributeChangedCallback(attr_name, old_value, new_value)
  {
  }

  Clr_Input()
  {
    const elems = this.querySelectorAll("[name]");
    if (!Utils.isEmpty(elems))
    {
      for (const elem of elems)
      {
        elem.value = null;
      }
    }
  }

  Get_Input()
  {
    let res = null;

    const elems = this.querySelectorAll("[name]");
    if (!Utils.isEmpty(elems))
    {
      res = {};
      for (const elem of elems)
      {
        const value = elem.value;
        if (Utils.isEmpty(value))
        {
          res[elem.name] = null;
        }
        else if (elem.type == "number")
        {
          res[elem.name] = elem.valueAsNumber;
        }
        else
        {
          res[elem.name] = value;
        }
      }
    }

    return res;
  }

  Set_Input(data)
  {
    const elems = this.querySelectorAll("[name]");
    if (!Utils.isEmpty(elems))
    {
      for (const elem of elems)
      {
        const value = data[elem.name]
        if (value == undefined)
        {
          elem.value = null;
        }
        else
        {
          elem.value = value;
        }
      }
    }
  }

  // rendering ==========================================================================

  Render()
  {
  }
}

Utils.Register_Element(Form_Buddy);

export default Form_Buddy;