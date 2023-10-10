﻿import { PolymerElement, html } from '/polymer/polymer/polymer-element.js';
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
      </a>
    `;
  }

  ready() 
  {
    super.ready();
    this.Render(this.query, this.db);
  }

  async Render(query, db) 
  {
    if (query)
    {
      this.Render_Title(query.title);
      this.Render_Query(query.id, db);
    }
    else
    {
      this.Render_Title("Technologies");
      await this.Render_Query(null, db);
      this.$.list_elem.show();
    }
  }

  async Render_Query(query_id, db)
  {
    this.child_queries = await window.Query.Select_Children_By_Id(query_id);
    if (this.child_queries && this.child_queries.length > 0)
    {
      const is_home_menu = query_id == null;
      this.is_menu = true;
      this.Render_Items(is_home_menu, db);
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
    const checkbox_elem = document.createElement("paper-checkbox");
    checkbox_elem.id = "checkbox";
    checkbox_elem.query = this.query;
    checkbox_elem.onclick = this.On_Choose_Chart;
    this.$.checkbox = checkbox_elem;

    this.$.item.query = this.query;
    this.$.item.onclick = this.On_Show_Chart;
    this.$.item.append(checkbox_elem);
  }

  Render_Items(is_home_menu, db)
  {
    if (is_home_menu)
    {
      const stats_elem = document.createElement("paper-icon-button");
      stats_elem.icon = "menu";
      this.$.item.append(stats_elem);
    }
    else
    {
      const stats_elem = document.createElement("paper-icon-button");
      stats_elem.icon = "trending-up";
      stats_elem.onclick = this.On_Choose_Trend.bind(this);
      this.$.item.append(stats_elem);
      this.$.open_icon.hidden = false;
    }

    const list_elem = document.createElement("iron-collapse");
    list_elem.id = "list";
    this.$.item.parentNode.append(list_elem);
    this.$.list_elem = list_elem;

    this.$.item.onclick = this.On_Toggle_Menu.bind(this);

    var c;

    for (c = 0; c < this.child_queries.length; c++)
    {
      const child_query = this.child_queries[c];
      const item_elem = document.createElement("query-menu-item");
      item_elem.db = db;
      item_elem.query = child_query;
      item_elem.On_Show_Chart = this.On_Show_Chart;
      item_elem.On_Choose_Chart = this.On_Choose_Chart;
      item_elem.On_Choose_Trend = this.On_Choose_Trend;
      list_elem.appendChild(item_elem);
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
