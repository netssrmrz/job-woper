import * as functions from 'firebase-functions/v2';
import Db from './tb/xdata.js';
import Query from './tb/Query.js';
import FB_Hosting from './tb/FB_Hosting.js';

var db = new Db();

async function Update_All_Trends()
{
  await db.Clr_Cache();
  await Query.Insert_Trends_Async(db);
  await Query.Select_Child_Objs(db, null);
}

async function Update_All_Trends_Request(req, res)
{
  await Update_All_Trends();

  res.status(200);
  res.end();
}

async function Test_Request(req, res)
{
  const file_content = await Query.Select_Child_Objs(db, null);
  const file_content_str = JSON.stringify(file_content);

  let upload_count = 0;
  const site_id = "trend-buddy-data";
  const cred_path = '../trend-buddy-firebase-adminsdk-ymhg3-c65d28fe1d.json';

  const ctx = new FB_Hosting(site_id, cred_path);
  ctx.Add_File(file_content_str, "/f1.txt");
  ctx.Add_File("a little cow", "/f2.txt");
  ctx.Add_File("whose fleece was...", "/f3.txt");
  upload_count = await ctx.Release_Files();

  res.status(200).send(upload_count + " files uploaded");
}

const runtimeOpts = {timeoutSeconds: 540};
export const updateAllTrendsScheduled = 
  functions
    .runWith(runtimeOpts)
    .pubsub
    .schedule('every day 11:30')
    .timeZone("Australia/Sydney")
    .onRun(Update_All_Trends);
export const updateAllTrends = 
  functions
    .runWith(runtimeOpts)
    .https
    .onRequest(Update_All_Trends_Request);
export const Test = 
  functions
    .runWith(runtimeOpts)
    .https
    .onRequest(Test_Request);
