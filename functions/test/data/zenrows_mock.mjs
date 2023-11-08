import fs from "fs";

const zenrows_mock =
{
  get: async function(indeed_url, options)
  {
    let res = 
    {
      data: 
      {
        class: "10 jobs"
      }
    };

    if (indeed_url.includes("q=error"))
    {
      res = null;
      throw new Error("zenrows_mock error");
    }
    else if (indeed_url.includes("q=null"))
    {
      res = null;
    }
    else if (indeed_url.includes("page"))
    {
      const res_html = fs.readFileSync("./functions/test/data/indeed3.html").toString();
      res.data = res_html;
    }

    return res;
  }
};

export default zenrows_mock;