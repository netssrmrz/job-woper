import Utils from "../lib/Utils.js";

export class Query_Rankings extends HTMLElement
{
  static tname = "query-rankings";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  set data(stats)
  {
    this.stats = stats;
    this.Render();
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

  // events =======================================================================================

  async On_Load_Callback()
  {
    let draw_data = this.Data_To_Array();
    const data_table = google.visualization.arrayToDataTable(draw_data);

    const options = 
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

    const chart = new google.visualization.BarChart(this.chart_div);
    chart.draw(data_table, options);
  }

  // rendering ====================================================================================

  Render() 
  {
    const html = `
      <div cid="title_div">Top 5</div>
      <div cid="chart_div"></div> 
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(this.On_Load_Callback);
  }
}

Utils.Register_Element(Query_Rankings);

export default Query_Rankings;