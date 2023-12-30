import Utils from "./Utils.js";

class Jobs
{
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

  static async Get_Job_Count(zenrows, query)
  {
    let count = null;

    const indeed_url = "https://www.indeed.com/jobs?q=" + Jobs.Encode2(query) + "&l=United+States";
    console.log("indeed_url:", indeed_url);
    const options =
    {
      "js_render": "true",
      //"wait": "3000",
      "css_extractor": "{\"class\":\"div.jobsearch-JobCountAndSortPane-jobCount\"}"
    };

    const clients = 
    [
      zenrows.get(indeed_url, options),
      zenrows.get(indeed_url, options),
      zenrows.get(indeed_url, options),
      zenrows.get(indeed_url, options),
      zenrows.get(indeed_url, options)
    ];

    try
    {
      const zen_res = await Promise.all(clients);
      count = zen_res.reduce(
        (max, res) => Jobs.Extract_Int_Count(res?.data) > max ? Jobs.Extract_Int_Count(res?.data) : max, 0);
    }
    catch (error)
    {
      console.error("Jobs.Get_Job_Count(): ", error.message);
      count = null;
    }

    return count;
  }

  static async Fetch_Job_Count(zenrows, query)
  {
    let count = null;

    const query_str = Jobs.Encode(query);
    const indeed_url = "https%3A%2F%2Fwww.indeed.com%2Fjobs%3Fq%3D"+query_str+"%26l%3DUnited%2BStates";
    const zenrows_url = 
      "https://api.zenrows.com/v1/?"+
      "apikey="+zenrows.apiKey+"&"+
      "url="+indeed_url+"&"+
      "js_render=true&"+
      "css_extractor=%257B%2522class%2522%253A%2522div.jobsearch-JobCountAndSortPane-jobCount%2522%257D";

    const requests = 
    [
      fetch(zenrows_url),
      fetch(zenrows_url),
      fetch(zenrows_url),
      fetch(zenrows_url),
      fetch(zenrows_url)
    ];

    try
    {
      const http_res = await Promise.all(requests);
      const json_res = http_res.map(res => res.json());
      const zen_res = await Promise.all(json_res);

      count = zen_res.reduce(
        (max, res) => Jobs.Extract_Int_Count(res) > max ? Jobs.Extract_Int_Count(res) : max, 0);
    }
    catch (error)
    {
      console.error("Jobs.Get_Job_Count(): ", error.message);
      count = null;
    }

    return count;
  }

  static Extract_Int_Count(zen_res)
  {
    console.log("zen_res:", zen_res);
    let count = null;

    if (zen_res?.class)
    {
      const zen_data = zen_res.class;
      const count_html = zen_data.replace(/\D/g,'');
      count = Number.parseInt(count_html);
    }

    return count;
  }

  static Encode(terms)
  {
    return terms
      .replaceAll("\"", "%2522")
      .replaceAll(" ", "%2B")
      .replaceAll("(", "%2528")
      .replaceAll(")", "%2529");
  }

  static Encode2(terms)
  {
    return terms
      .replaceAll("\"", "%22")
      .replaceAll(" ", "+")
      .replaceAll("(", "%28")
      .replaceAll(")", "%29");
  }

  static async Get_Job_Page(zenrows, query)
  {
    const query_str = Jobs.Encode(query);
    const indeed_url = "https%3A%2F%2Fwww.indeed.com%2Fjobs%3Fq%3D"+query_str+"%26l%3DUnited%2BStates";
    const zenrows_url = "https://api.zenrows.com/v1/?apikey="+zenrows.apiKey+"&url="+indeed_url+"&js_render=true";
    const zen_res = await fetch(zenrows_url);
    const xRequestId = zen_res.headers.get("x-request-id");

    const html = await zen_res.text();
    const count = Jobs.Extract_Count(html);

    return {html, count, zenrows_url, xRequestId};
  }

  static async xGet_Job_Page(zenrows, query)
  {
    const options =
    {
      "js_render": "true",
    };

    const indeed_url = "https://www.indeed.com/jobs?q=" + Jobs.Encode2(query) + "&l=United+States";
    console.log("indeed_url:", indeed_url);
    const zen_res = await zenrows.get(indeed_url, options);
    console.log("x-request-id:", zen_res.headers["x-request-id"]);
    const html = zen_res.data;
    const count = Jobs.Extract_Count(html);

    return {html, count, indeed_url};
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
