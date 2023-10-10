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
  it('Select_Chart_Vals_By_Query', Select_Chart_Vals_By_Query);

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

function To_Chart_Vals()
{
  const query_title = "test";
  const groups = 
  {
    '123': 
    [ 
      { datetime: 123, count: 1 }, 
      { datetime: 123, count: 2 } 
    ],
    '279': 
    [ 
      { datetime: 222, count: 3 }, 
      { datetime: 234, count: 4 } 
    ],
    '357': 
    [ 
      { datetime: 333, count: 5 } 
    ],
    '513': 
    [
      { datetime: 444, count: 6 },
      { datetime: 513, count: 7 },
      { datetime: 513, count: 8 },
      { datetime: 511, count: 9 },
      { datetime: 456, count: 10 }
    ]
  };
  
  const actual = Trend.To_Chart_Vals(groups, query_title);
  assert.equal(actual.length, 5);
  assert.equal(actual[0][0], "Date");
  assert.equal(actual[0][1], query_title);
  assert.equal(actual[1][0], 123);
  assert.equal(actual[1][1], 1.5);
  assert.equal(actual[2][0], 279);
  assert.equal(actual[2][1], 3.5);
  assert.equal(actual[3][0], 357);
  assert.equal(actual[3][1], 5);
  assert.equal(actual[4][0], 513);
  assert.equal(actual[4][1], 8);
}

async function Select_Chart_Vals_By_Query()
{
  const query = {id: "-KpXaq_9Y_gdfEalxOmu", title: "Test Query"};

  const actual = await Trend.Select_Chart_Vals_By_Query(db, query);
  assert.equal(actual.length > 1, true);
  assert.equal(actual[0][0], "Date");
  assert.equal(actual[0][1], query.title);
}