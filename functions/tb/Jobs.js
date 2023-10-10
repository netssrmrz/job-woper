import Utils from "./Utils.js";
import config from "../config.mjs";

class Jobs
{
  static xGet_Job_Count(query, success_fn)
  {
    var path;
    const pub_id = "???";

    //console.log("Jobs.Get_Job_Count: query =", query);
    path =
      "/ads/apisearch?" +
      "publisher=" + pub_id + "&" +
      "q=" + encodeURIComponent(query) + "&" +
      "limit=0&" +
      "userip=1.2.3.4&" +
      "useragent=Mozilla/%2F4.0%28Firefox%29&" +
      "v=2&" +
      "format=json";
    Util.Req_Json("api.indeed.com", 80, path, Req_Json_OK);
    function Req_Json_OK(res)
    {
      var count = 0;

      if (res != null)
        count = res.totalResults;
      if (success_fn != null)
        success_fn(count);
    }
  }

  static async xGet_Job_Count_Async(query)
  {
    //console.log("Jobs.Get_Job_Count_Async: query =", query);
    const pub_id = "???";
    let count = 0;
    const url =
      "http://api.indeed.com/ads/apisearch?" +
      "publisher=" + pub_id + "&" +
      "q=" + encodeURIComponent(query) + "&" +
      "limit=0&" +
      "userip=1.2.3.4&" +
      "useragent=Mozilla/%2F4.0%28Firefox%29&" +
      "v=2&" +
      "format=json";
    const res = await Util.Fetch_Json(url);
    if (res)
    {
      if (res.error)
      {
        console.error("Jobs.Get_Job_Count_Async(): error =", res.error);
      }
      else
      {
        console.log("Jobs.Get_Job_Count_Async(): res =", res);
        count = res.totalResults;
      }
    }

    return count;
  }
  
  static async xGet_Job_Count_By_Scrape(query)
  {
    const url =
      "https://www.indeed.com/jobs?" +
      "q=" + encodeURIComponent(query);
    const headers =
    {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
    };
    const res_html = await Util.Req_Text(url, null, headers);
    const count = Jobs.Extract_Count_2(res_html);

    return count;
  }

  static xExtract_Count(res_html)
  {
    let count = 0;

    if (res_html)
    {
      const div_html = Jobs.Extract_Str(res_html, "<span>Page", "</span>", 0);
      if (div_html)
      {
        let count_html = Jobs.Extract_Str(div_html, " of ", " jobs", 0);
        if (count_html)
        {
          count_html = count_html.replace(/\D/g,'');
          count = Number.parseInt(count_html);
        }
      }
    }

    return count;
  }

  static async Get_Job_Count(query)
  {
    const api_key = config.zen_rows_api_key;
    const zenrows_url = "https://api.zenrows.com/v1/?apikey=" + api_key + "&js_render=true&url=";
    const indeed_url = encodeURIComponent("https://www.indeed.com/jobs?q=" + query);
    const url = zenrows_url + indeed_url;
    const res_html = await Utils.Fetch_Text(url);
    const count = Jobs.Extract_Count(res_html);

    return count;
  }

  static Extract_Count(res_html)
  {
    let count = 0;

    if (res_html)
    {
      const div_html = Utils.Extract_Str(res_html, '<div class="jobsearch-JobCountAndSortPane-jobCount', "<span class", 0);
      if (div_html)
      {
        let count_html = Utils.Extract_Str(div_html, "<span>", "</span>", 0);
        if (count_html)
        {
          count_html = count_html.replace(/\D/g,'');
          count = Number.parseInt(count_html);
        }
      }
    }

    return count;
  }
}

export default Jobs;
