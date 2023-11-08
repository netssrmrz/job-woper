import firebase from 'firebase-admin';
import * as functions from 'firebase-functions/v2';
import express from 'express';
import cors from 'cors';
import RPC_Buddy from 'rpc-buddy';
import Db_Realtime from './tb/Db_Realtime.mjs';
import Trend from './tb/Trend.js';
import Query from './tb/Query.js';
import Utils from './tb/Utils.js';
import Jobs from './tb/Jobs.js';
import Admin from './tb/Admin.js';

firebase.initializeApp();
const fb_db = firebase.database();
const fb_auth = firebase.auth();

const db = new Db_Realtime(fb_db);

const app = express();
app.use(cors());

const on_auth_fn = (req) => Admin.Has_Auth(req, fb_auth);
Jobs.is_class = true;
Trend.is_class = true;
const rpc_buddy = new RPC_Buddy
(
  app, 
  '/rpc-server', 
  '/rpc-client',
  [
    Trend, Query, Jobs, Admin
  ],
  [
    {name: "Trend.Select_All", inject: [db]}, 
    {name: "Trend.Get_Query_Title", inject: [db]}, 
    {name: "Trend.Select_Stats_By_Query_Ids", inject: [db]}, 
    {name: "Trend.Select_Chart_Vals_By_Query_Id", inject: [db]}, 
    {name: "Trend.Select_Chart_Vals_By_Query_Ids", inject: [db]}, 
    {name: "Trend.Select_Last_Date", inject: [db]}, 
    {name: "Trend.Delete_By_Ids", inject: [db], on_auth_fn}, 
    {name: "Trend.Insert_By_Query", inject: [db, Jobs], on_auth_fn}, 
    {name: "Trend.Save", inject: [db], on_auth_fn}, 
    {name: "Trend.Insert_Interpolation", inject: [db], on_auth_fn}, 
    
    {name: "Query.Select_All", inject: [db, Trend]}, 
    {name: "Query.Select_Count", inject: [db]}, 
    {name: "Query.Select_By_Title", inject: [db]}, 
    {name: "Query.Select_Children_By_Id", inject: [db]}, 
    {name: "Query.Select_By_Id", inject: [db]}, 
    {name: "Query.Select_As_Options", inject: [db, Trend]}, 
    {name: "Query.Save", inject: [db], on_auth_fn}, 
    {name: "Query.Delete", inject: [db], on_auth_fn}, 
    {name: "Query.Insert_All", inject: [db, Trend, Jobs], on_auth_fn}, 

    {name: "Jobs.Get_Job_Count", on_auth_fn}, 
    {name: "Jobs.Get_Job_Page", on_auth_fn}, 

    {name: "Admin.Refresh_Token", on_auth_fn}, 
  ],
  RPC_Buddy.Express
);
rpc_buddy.client_cache_control = "max-age=2592000"; // 30 days

const api_options =
{
  region: ["australia-southeast1"],
  minInstances: 0,
  concurrency: 80
};
export const api = 
  functions
    .https
    .onRequest(api_options, app);

const schedule_options = 
{
  region: ["australia-southeast1"],
  timeoutSeconds: 540,
  schedule: 'every day 01:00',
  timeZone: "Australia/Sydney"
};
export const updateAllTrendsScheduled = 
  functions
    .scheduler
    .onSchedule(schedule_options, () => Query.Insert_All(db, Trend, Jobs));

const schedule_options_2 = 
{
  region: ["australia-southeast1"],
  timeoutSeconds: 540,
  schedule: 'every day 13:00',
  timeZone: "Australia/Sydney"
};
export const updateAllTrendsScheduled2 = 
  functions
    .scheduler
    .onSchedule(schedule_options_2, () => Query.Insert_All(db, Trend, Jobs));
    