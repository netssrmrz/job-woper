import Utils from "../lib/Utils.js";

export class Query_Weights extends HTMLElement
{
  static tname = "query-weights";

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
      const value = [stat.title, stat.last_entry.count, "color: #0c0"];
      values.push(value);
    }

    return values;
  }

  // events =======================================================================================

  On_Load_Callback()
  {
    const draw_data = this.Data_To_Array();
    const data_table = google.visualization.arrayToDataTable(draw_data);

    const options = 
    {
      chartArea: { xwidth: "80%", height: "85%" },
      legend:
      {
        position: "right",
        textStyle: { fontName: "hyperspace-bold", fontSize: 11, color: "#00ff00" }
      },
      animation: { startup: false, duration: 0, easing: 'linear', },
      fontName: "roboto",
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
      },
      pieSliceTextStyle: { color: "#000" },
      pieSliceBorderColor: "#000"
    };

    const chart = new google.visualization.PieChart(this.chart_div);
    chart.draw(data_table, options);
  }

  // rendering ====================================================================================

  Render() 
  {
    const html = `
      <div cid="title_div">Weights</div>
      <div cid="chart_div"></div> 
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(this.On_Load_Callback);
  }
}

Utils.Register_Element(Query_Weights);

export default Query_Weights;