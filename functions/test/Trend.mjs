import assert from "assert";
import firebase from 'firebase-admin';
import Db_Realtime from "../tb/Db_Realtime.mjs"
import Trend from "../tb/trend.js"
import config from './config.mjs';

let db = null, fb_app = null;

describe('class Trend', Trend_Tests);

function Trend_Tests() 
{
  this.timeout(5000);
  before(Init);

  it('Get_Query_Title', Get_Query_Title);
  it('Select_All', Select_All);
  it('To_Chart_Vals', To_Chart_Vals);
  it('Select_Chart_Vals_By_Query_Id', Select_Chart_Vals_By_Query_Id);
  it('Select_Chart_Vals_By_Query_Ids', Select_Chart_Vals_By_Query_Ids);
  it('Select_By_Query_Ids', Select_By_Query_Ids);

  after(Cleanup);
}

function Init()
{
  const app_config =
  {
    credential: firebase.credential.cert(config),
    databaseURL: "https://trend-buddy-dev.firebaseio.com",
  };
  fb_app = firebase.initializeApp(app_config);
  const fb_db = firebase.database();
  db = new Db_Realtime(fb_db);
}

function Cleanup()
{
  fb_app.delete();
}

async function Get_Query_Title() 
{
  const actual = await Trend.Get_Query_Title(db, "-KpXaq_9Y_gdfEalxOmu");
  const expected = "Angular";
  const msg = actual + ' should match title ' + expected;
  assert.equal(actual, expected, msg);
}

async function Select_All() 
{
  let objs = await Trend.Select_All(db);
  let msg = 'should return objects';
  assert.equal(objs != null, true, msg);
  msg = 'should return multiple objects';
  assert.equal(objs.length > 0, true, msg);
}

async function To_Chart_Vals()
{
  let query_ids = ["-KpXaq_9Y_gdfEalxOmu"];
  let groups = 
  {
    '123': 
    [ 
      { datetime: 123, count: 1, query_id: "-KpXaq_9Y_gdfEalxOmu" }, 
      { datetime: 123, count: 2, query_id: "-KpXaq_9Y_gdfEalxOmu" } 
    ],
    '279': 
    [ 
      { datetime: 222, count: 3, query_id: "-KpXaq_9Y_gdfEalxOmu" }, 
      { datetime: 234, count: 4, query_id: "-KpXaq_9Y_gdfEalxOmu" } 
    ],
    '357': 
    [ 
      { datetime: 333, count: 5, query_id: "-KpXaq_9Y_gdfEalxOmu" } 
    ],
    '513': 
    [
      { datetime: 444, count: 6, query_id: "-KpXaq_9Y_gdfEalxOmu" },
      { datetime: 513, count: 7, query_id: "-KpXaq_9Y_gdfEalxOmu" },
      { datetime: 513, count: 8, query_id: "-KpXaq_9Y_gdfEalxOmu" },
      { datetime: 511, count: 9, query_id: "-KpXaq_9Y_gdfEalxOmu" },
      { datetime: 456, count: 10, query_id: "-KpXaq_9Y_gdfEalxOmu" }
    ]
  };
  let actual = await Trend.To_Chart_Vals(db, groups, query_ids);
  assert.equal(actual.length, 5);
  assert.equal(actual[0][0], "Date");
  assert.equal(actual[0][1], "Angular");
  assert.equal(actual[1][0], 123);
  assert.equal(actual[1][1], 1.5);
  assert.equal(actual[2][0], 279);
  assert.equal(actual[2][1], 3.5);
  assert.equal(actual[3][0], 357);
  assert.equal(actual[3][1], 5);
  assert.equal(actual[4][0], 513);
  assert.equal(actual[4][1], 8);

  query_ids = ["-KpXaq_9Y_gdfEalxOmu", "-KpPWAFGBhe6CxLYn22r"];
  groups = 
  {
    '123': 
    [ 
      { datetime: 123, count: 1, query_id: "-KpXaq_9Y_gdfEalxOmu" }, 
      { datetime: 123, count: 2, query_id: "-KpPWAFGBhe6CxLYn22r" } 
    ],
    '279': 
    [ 
      { datetime: 222, count: 3, query_id: "-KpXaq_9Y_gdfEalxOmu" }, 
      { datetime: 234, count: 4, query_id: "-KpXaq_9Y_gdfEalxOmu" } 
    ],
    '357': 
    [ 
      { datetime: 333, count: 5, query_id: "-KpPWAFGBhe6CxLYn22r" } 
    ],
    '513': 
    [
      { datetime: 444, count: 6, query_id: "-KpXaq_9Y_gdfEalxOmu" },
      { datetime: 513, count: 7, query_id: "-KpXaq_9Y_gdfEalxOmu" },
      { datetime: 513, count: 8, query_id: "-KpXaq_9Y_gdfEalxOmu" },
      { datetime: 511, count: 9, query_id: "-KpPWAFGBhe6CxLYn22r" },
      { datetime: 456, count: 10, query_id: "-KpPWAFGBhe6CxLYn22r" }
    ]
  };
  
  actual = await Trend.To_Chart_Vals(db, groups, query_ids);
  assert.equal(actual.length, 5);
  assert.equal(actual[0][0], "Date");
  assert.equal(actual[0][1], "Angular");
  assert.equal(actual[0][2], "Polymer");
  assert.equal(actual[1][0], 123);
  assert.equal(actual[1][1], 1);
  assert.equal(actual[1][2], 2);
  assert.equal(actual[2][0], 279);
  assert.equal(actual[2][1], 3.5);
  assert.equal(actual[2][2], null);
  assert.equal(actual[3][0], 357);
  assert.equal(actual[3][1], null);
  assert.equal(actual[3][2], 5);
  assert.equal(actual[4][0], 513);
  assert.equal(actual[4][1], 7);
  assert.equal(actual[4][2], 9.5);
}

async function Select_Chart_Vals_By_Query_Id()
{
  const query_id = "-KpXaq_9Y_gdfEalxOmu";

  const actual = await Trend.Select_Chart_Vals_By_Query_Id(db, query_id);
  assert.equal(actual.length > 1, true);
  assert.equal(actual[0][0], "Date");
  assert.equal(actual[0][1], "Angular");
}

async function Select_Chart_Vals_By_Query_Ids()
{
  let query_ids = ["-KpXaq_9Y_gdfEalxOmu"];
  let actual = await Trend.Select_Chart_Vals_By_Query_Ids(db, query_ids);
  assert.ok(actual.length > 1);
  assert.equal(actual[0].length, 2);
  assert.equal(actual[0][0], "Date");
  assert.equal(actual[0][1], "Angular");

  query_ids = ["-KpXaq_9Y_gdfEalxOmu", "-KpPWAFGBhe6CxLYn22r"];
  actual = await Trend.Select_Chart_Vals_By_Query_Ids(db, query_ids);
  assert.ok(actual.length > 1);
  assert.equal(actual[0].length, 3);
  assert.equal(actual[0][0], "Date");
  assert.equal(actual[0][1], "Angular");
  assert.equal(actual[0][2], "Polymer");
}

async function Select_By_Query_Ids() 
{
  const ids = ["-KpPWAFGBhe6CxLYn22r", "-KpXaq_9Y_gdfEalxOmu", "-KpXslqMtFHHl1zTgy66"];
  let actual = await Trend.Select_By_Query_Ids(db, ids);
  assert.ok(ids.includes(actual[0].query_id));
  assert.ok(ids.includes(actual[1].query_id));
  assert.ok(ids.includes(actual[2].query_id));
  assert.ok(ids.includes(actual[3].query_id));
  assert.ok(ids.includes(actual[4].query_id));
}
