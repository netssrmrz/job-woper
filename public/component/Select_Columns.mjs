import Utils from "../lib/Utils.js";

class Select_Columns extends HTMLElement 
{
  static tname = "select-columns";

  constructor() 
  {
    super();

    this.edit_class = "edit_columns";
    this.update_event = new Event('update');

    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
    this.hidden = false;
  }

  disconnectedCallback()
  {

  }

  adoptedCallback()
  {

  }

  //static observedAttributes = ["attr-name"];
  attributeChangedCallback(attrName, oldValue, newValue)
  {

  }

  get value()
  {
    let col_items = null;

    if (this?.column_list?.children && this?.column_list?.children.length > 0)
    {
      col_items = [];
      for (const col_item of this.column_list.children)
      {
        const id = col_item.getAttribute("col-id");
        if (id)
        {
          const col_btn_id = "col_btn_" + id;
          const visible = this[col_btn_id].checked;
          const column = {id, visible};
          col_items.push(column);
        }
      }
    }

    return col_items;
  }

  set value(col_items)
  {
    if (col_items && col_items.length > 0)
    {
      for (const column of col_items)
      {
        const col_btn_id = "col_btn_" + column.id;
        const elem = this[col_btn_id];
        if (elem)
        {
          elem.checked = column.visible;
        }
      }
      this.dispatchEvent(this.update_event);
    }
  }

  Save()
  {
    if (this.id)
    {
      const value_str = JSON.stringify(this.value);
      localStorage.setItem(this.id, value_str);
    }
  }

  Load()
  {
    if (this.id)
    {
      const value_str = localStorage.getItem(this.id);
      this.value = JSON.parse(value_str);
    }
  }

  showModal()
  {
    this.column_list_dlg.showModal();
  }

  // events =======================================================================================
  
  On_Click_Close()
  {
    // hide field menu
    this.column_list_dlg.close();
  }
  
  On_Change_Column(e, sort)
  {
    // hide field menu
    this.column_list.classList.remove(this.edit_class);

    this.Save();
    this.dispatchEvent(this.update_event);
  }

  // rendering ====================================================================================

  Render()
  {
    const col_items = this.children;
    for (const col_item of col_items)
      this.Render_Column_Item(col_item);

    const html = `
      <dialog id="column_list_dlg">
        <div class="dialog_header">
          <button id="close_btn" class="btn close_btn">
            <span class="cancel_btn_label">✕</span>
          </button> 
          Manage Columns
        </div>
        <div class="dialog_body">
          <ul id="column_list" class="column_list"></ul>
        </div>
      </dialog>
    `;
    const elems = Utils.toDocument(html);
    elems.getElementById("column_list").append(...col_items);
    this.append(elems);

    Utils.Set_Id_Shortcuts(this, this);

    this.close_btn.addEventListener("click", this.On_Click_Close);
  }

  Render_Column_Item(col_item)
  {
    const col_id = col_item.getAttribute("col-id");
    const col_text = col_item.innerText;

    const col_btn = document.createElement("input");
    col_btn.id = "col_btn_" + col_id;
    col_btn.type = "checkbox";
    col_btn.checked = true;
    col_btn.classList.add("btn");
    col_btn.classList.add("col_btn");
    col_btn.addEventListener("change", e => this.On_Change_Column(e));

    col_item.classList.add("column_item");
    col_item.append(col_btn);
  }
}

Utils.Register_Element(Select_Columns);

export default Select_Columns;