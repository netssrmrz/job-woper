import { PolymerElement, html } from '/polymer/polymer/polymer-element.js';
import '/polymer/paper-checkbox/paper-checkbox.js';

export class QueryMenuItem extends PolymerElement
{
  static get template() 
  {
    return html`
      <style>
        .menu_icon
        {
          margin: -10px -10px -10px -10px;
          padding: 0px;
          xborder: 1px solid #f00;
        }
    
        a
        {
          font-family: hyperspace-bold;
          font-size: 14px;
          display: block;
          padding: 10px 20px 10px 20px;
          background-color: black;
        }
    
        a:hover
        {
          background-color: #004400;
          cursor: pointer;
        }

        paper-checkbox
        {
          float: right;
          --paper-checkbox-unchecked-color: #00ff00;
          --paper-checkbox-checked-color: #00ff00; 
          --paper-checkbox-checkmark-color: #000000;
        }

        #list
        {
          padding-left: 15px;
        }

        paper-icon-button iron-icon
        {
          color: #616161;
          margin-right: 20px;
          vertical-align: text-bottom;
        }

        paper-icon-button
        {
          float: right;
          padding: 0px;
          width: 26px;
          height: 26px;
          margin: -4px 4px 0px 0px;
        }
      </style>

      <a id="item">
        <iron-icon id="open_icon" icon="arrow-drop-down" class="menu_icon" hidden></iron-icon>
        <iron-icon id="close_icon" icon="arrow-drop-up" class="menu_icon" hidden></iron-icon>
        <span id="title"></span>
        <paper-checkbox id="checkbox" hidden></paper-checkbox>
        <paper-icon-button id="menu_btn" icon="menu" hidden></paper-icon-button>
        <paper-icon-button id="summ_btn" icon="trending-up" hidden></paper-icon-button>
      </a>
      <iron-collapse id="list_elem" hidden></iron-collapse>
    `;
  }

  ready() 
  {
    super.ready();
    this.Render(this.query);
  }

  set checked_ids(ids)
  {
    if (this.Is_Menu())
    {
      for (const elem of this.$.list_elem.children)
        elem.checked_ids = ids;
    }
    else if (this?.query?.id && ids.includes(this.query.id))
    {
      this.$.checkbox.checked = true;
    }
  }

  set On_Get_Children(fn)
  {
    this.On_Get_Children_Fn = fn;
    if (this.isConnected)
    {
      this.Render(this.query);
    }
  }

  get On_Get_Children()
  {
    return this.On_Get_Children_Fn;
  }

  Render(query) 
  {
    if (this.On_Get_Children)
    {
      if (query)
      {
        this.Render_Title(query.title);
        this.Render_Query(query.id);
      }
      else
      {
        this.Render_Title("Technologies");
        this.Render_Query(null);
        this.$.list_elem.show();
      }
    }
  }

  Render_Query(query_id)
  {
    if (this.On_Get_Children)
    {
      this.child_queries = this.On_Get_Children(query_id);
    }

    if (this.child_queries && this.child_queries.length > 0)
    {
      const is_home_menu = query_id == null;
      this.is_menu = true;
      this.Render_Items(is_home_menu);
    }
    else
    {
      this.is_menu = false;
      this.Render_Item();
    }
  }

  Render_Title(title)
  {
    this.$.title.textContent = title;
  }

  Render_Item()
  {
    this.$.checkbox.query = this.query;
    this.$.checkbox.onclick = this.On_Choose_Chart;
    this.$.checkbox.hidden = false;

    this.$.item.query = this.query;
    this.$.item.onclick = this.On_Show_Chart;
  }

  Render_Items(is_home_menu)
  {
    if (is_home_menu)
    {
      this.$.menu_btn.hidden = false;
    }
    else
    {
      this.$.summ_btn.onclick = this.On_Choose_Trend.bind(this);
      this.$.summ_btn.hidden = false;
      this.$.open_icon.hidden = false;
    }

    this.$.list_elem.hidden = false;

    this.$.item.onclick = this.On_Toggle_Menu.bind(this);

    for (const child_query of this.child_queries)
    {
      const item_elem = document.createElement("query-menu-item");
      item_elem.query = child_query;
      item_elem.On_Show_Chart = this.On_Show_Chart;
      item_elem.On_Choose_Chart = this.On_Choose_Chart;
      item_elem.On_Choose_Trend = this.On_Choose_Trend;
      item_elem.On_Get_Children = this.On_Get_Children;
      this.$.list_elem.appendChild(item_elem);
    }
  }

  On_Toggle_Menu(event)
  {
    this.$.list_elem.toggle();
    if (this.$.list_elem.opened)
    {
      this.$.open_icon.hidden = true;
      this.$.close_icon.hidden = false;
    }
    else
    {
      this.$.open_icon.hidden = false;
      this.$.close_icon.hidden = true;
    }
  }

  Uncheck()
  {
    var chk_elems, i;

    if (this.Is_Menu())
    {
      chk_elems = this.$.list_elem.children;
      for (i = 0; i < chk_elems.length; i++)
        chk_elems[i].Uncheck();
    }
    else
    {
      this.$.checkbox.checked = false;
    }
  }

  Is_Menu()
  {
    return this.is_menu;
  }
}
customElements.define('query-menu-item', QueryMenuItem);
