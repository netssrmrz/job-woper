import google from 'googleapis';
import Utils from './xUtil.js';
import crypto from 'crypto';
import zlib from 'zlib';

class FB_Hosting
{
  constructor(site_id, cred_path)
  {
    this.site_id = site_id;
    this.cred_path = cred_path;
    this.access_token = null;
    this.name = null;
    this.files = [];
  }

  async New_Version()
  {
    let res = false;
    const url = "https://firebasehosting.googleapis.com/v1beta1/sites/" + this.site_id + "/versions";
    const headers = 
    {
      Authorization: "Bearer " + this.access_token,
      "Content-Type": "application/json"
    }
    const json_res = await Utils.Fetch_Json(url, "post", headers);
    if (json_res.status == "CREATED")
    {
      this.name = json_res.name;
      res = true;
    }

    return res;
  }

  Add_File(content_str, name)
  {
    const content = zlib.gzipSync(content_str);
    const hash = crypto.createHash('sha256').update(content).digest("hex");
    this.files.push({name, content, hash});
  }

  Populate_Files()
  {
    const url = "https://firebasehosting.googleapis.com/v1beta1/" + this.name + ":populateFiles";
    const headers = 
    {
      Authorization: "Bearer " + this.access_token,
      "Content-Type": "application/json"
    }

    const files = {};
    for (const file of this.files)
    {
      files[file.name] = file.hash;
    }

    return Utils.Fetch_Json(url, "post", headers, JSON.stringify({files}));
  }

  async Upload_Files(base_url, hashes)
  {
    let res = 0;

    if (!Utils.Empty(hashes))
    {
      for (const hash of hashes)
      {
        const file = this.files.find(file => file.hash == hash);
        const isUploaded = await this.Upload_File(base_url, file.hash, file.content)
        if (isUploaded)
        {
          res++;
        }
        //console.log("FB_Hosting.Upload_Files(): res =", res);
      }
    }

    return res;
  }

  async Upload_File(base_url, file_hash, file_content)
  {
    let res = false;
    const url = base_url + "/" + file_hash;
    const headers = 
    {
      Authorization: "Bearer " + this.access_token,
      "Content-Type": "application/octet-stream"
    }

    const http_res = await Utils.Fetch(url, "post", headers, file_content);
    const response_text = await http_res.text();
    if (http_res.ok)
    {
      res = true;
    }
    else
    {
      console.error("FB_Hosting.Upload_File(): response_text =", response_text);
    }

    return res;
  }

  async Finalize_Version()
  {
    let res = false;
    const url = "https://firebasehosting.googleapis.com/v1beta1/" + this.name + "?update_mask=status";
    const headers = 
    {
      Authorization: "Bearer " + this.access_token,
      "Content-Type": "application/json"
    }
    const body = {"status": "FINALIZED"};
    const json_res = await Utils.Fetch_Json(url, "patch", headers, JSON.stringify(body));
    if (json_res && json_res.status == "FINALIZED")
    {
      res = true;
    }

    return res;
  }

  async Release_Version()
  {
    let res = false;
    const url = "https://firebasehosting.googleapis.com/v1beta1/sites/" + this.site_id + "/releases?versionName=" + this.name;
    const headers = 
    {
      Authorization: "Bearer " + this.access_token,
      "Content-Type": "application/json"
    }
    const json_res = await Utils.Fetch_Json(url, "post", headers);
    if (json_res.type == "DEPLOY")
    {
      res = true;
    }

    return res;
  }

  async Release_Files()
  {
    let res = 0;

    await this.Get_Access_Token();
    if (await this.New_Version())
    {
      const upload_res = await this.Populate_Files();
      const upload_count = await this.Upload_Files(upload_res.uploadUrl, upload_res.uploadRequiredHashes);

      if (await this.Finalize_Version())
      {
        if (await this.Release_Version())
        {
          res = upload_count;
        }
      }
    }

    return res;
  }

  async Get_Access_Token() 
  {
    const t = this;
    if (!this.access_token)
    {
      this.access_token = await new Promise(Do_Promise);
      function Do_Promise(resolve, reject) 
      {
        const SCOPES = ["https://www.googleapis.com/auth/firebase"];
        var key = require(t.cred_path);
        var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, SCOPES, null);
        jwtClient.authorize(Authorize);
        function Authorize(err, tokens) 
        {
          if (err) 
          {
            reject(err);
            return;
          }
          resolve(tokens.access_token);
        }
      }
    }
  }
}

export default FB_Hosting;