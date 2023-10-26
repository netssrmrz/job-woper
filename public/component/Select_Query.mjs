import Utils from "../lib/Utils.js";

class Select_Query extends HTMLElement 
{
  static tname = "select-query";

  constructor() 
  {
    super();
  }

  connectedCallback()
  {
  }

  //

  get value()
  {
    return this.select_elem?.value;
  }

  set value(option_value)
  {
    if (this.select_elem)
    {
      this.select_elem.value = option_value;
    }
  }

  set options(items)
  {
    this.Render_Options(items);
  }

  // events =======================================================================================

  // rendering ====================================================================================

  Render_Options(options)
  {
    if (!Utils.isEmpty(options))
    {
      this.select_elem = document.createElement("select");
      this.replaceChildren(this.select_elem);

      const option_elem = document.createElement("option");
      option_elem.value = null;
      option_elem.innerText = "";
      this.select_elem.append(option_elem);

      for (const option of options)
      {
        const option_elem = document.createElement("option");
        option_elem.value = option.value;
        option_elem.innerText = option.text;
        this.select_elem.append(option_elem);
      }
    }
  }
}

Utils.Register_Element(Select_Query);

export default Select_Query;