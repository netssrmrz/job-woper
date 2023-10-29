﻿import { PolymerElement, html } from '/polymer/polymer/polymer-element.js';

export class QueryRankings extends PolymerElement
{
  static get template() 
  {
    return html`
      <style>
        :host
        {
          display: inline-block;
          width: 400px;
          height: 250px;
          xborder: 1px solid #f00;
          overflow: hidden;
        }
      </style>

      <div id="title_div">Top 5</div>
      <div id="chart_div"></div> 
    `;
  }

  async ready() 
  {
    super.ready();
    this.Init_Chart(this.$.chart_div);
  }

  Init_Chart(chart_elem)
  {
    Load_OK = Load_OK.bind(this);
    google.charts.setOnLoadCallback(Load_OK);
    google.charts.load('current', { 'packages': ['corechart'] });
    function Load_OK()
    {
      const chart = new google.visualization.BarChart(chart_elem);
      chart_elem.chart = chart;

      let draw_data = this.Data_To_Array();
      this.Draw_Chart(chart_elem, draw_data);
    }
  }

  Draw_Chart(chart_elem, draw_data)
  {
    var data_table, options;

    data_table = google.visualization.arrayToDataTable(draw_data);
    options = 
    {
      chartArea: { xwidth: "80%", height: "85%" },
      legend:
      {
        position: "none",
        textStyle: { fontName: "hyperspace-bold", fontSize: 14, color: "#00ff00" }
      },
      animation: { startup: false, duration: 0, easing: 'linear', },
      fontName: "hyperspace-bold",
      fontSize: 11,
      backgroundColor: "#000000",
      vAxis:
      {
        baselineColor: "#002200",
        gridlines: { color: "#002200" },
        minorGridlines: { color: "#002200" },
        textStyle: { color: "#00ff00" }
      },
      hAxis:
      {
        baselineColor: "#002200",
        gridlines: { color: "#002200" },
        minorGridlines: { color: "#002200" },
        textStyle: { color: "#00ff00" }
      },
      tooltip:
      {
        trigger: "none",
        textStyle: { color: "#00ff00" },
        isHtml: true
      }
    };
    chart_elem.chart.draw(data_table, options);
  }

  Data_To_Array()
  {
    const titles = ["Tech", "Job Count", { role: 'style' }];
    const values = [titles];

    for (const stat of this.stats)
    {
      const value = [this.Trim(stat.title), stat.last_entry.count, "color: #0c0"];
      values.push(value);
    }

    return values;
  }

  Trim(str)
  {
    let res = str;
    const max_length = 9;

    if (str && str.length>max_length)
    {
      res = str.substring(0, max_length);
    }

    return res;
  }
}
customElements.define('query-rankings', QueryRankings);
