import assert from "assert";
import firebase from 'firebase-admin';
import Db_Realtime from "../tb/Db_Realtime.mjs";
import Query from "../tb/Query.js";
import Trend from "../tb/Trend.js";
import Jobs from "../tb/Jobs.js";
import config from './config.mjs';
import db_mock from './data/db_mock.mjs';
import zenrows_mock from './data/zenrows_mock.mjs';
import {ZenRows} from "zenrows";

const api_key = config.zen_rows_api_key;
const zenrows = new ZenRows(api_key);
let db = null, fb_app = null;

describe('class Query', Query_Tests);

function Init()
{
  const app_config =
  {
    credential: firebase.credential.cert(config),
    databaseURL: "https://job-woper-default-rtdb.asia-southeast1.firebasedatabase.app",
  };
  fb_app = firebase.initializeApp(app_config);
  const fb_db = firebase.database();
  db = new Db_Realtime(fb_db);
  db.read_only = true;
}

function Cleanup()
{
  fb_app.delete();
}

function Query_Tests() 
{
  this.timeout(5000);
  before(Init);

  it('Select_By_Title', Select_By_Title);
  it('Order_By', Order_By);
  it('Has_Data_Today', Has_Data_Today);
  it('Insert_All', Insert_All);
  it('Select_As_Options', Select_As_Options);

  after(Cleanup);
}

async function Insert_All()
{
  db_mock.Reset();
  await Query.Insert_All(db_mock, Trend, Jobs, zenrows_mock);
  let new_ids = db_mock.Get_New_Ids("trend");
  assert.equal(new_ids.length, 2);

  await Query.Insert_All(db_mock, Trend, Jobs, zenrows_mock);
  new_ids = db_mock.Get_New_Ids("trend");
  assert.equal(new_ids.length, 2, "# of new ids should not change");
}

async function Has_Data_Today()
{
  let actual = await Query.Has_Data_Today(db_mock, Trend, "ccc");
  assert.ok(actual);

  actual = await Query.Has_Data_Today(db_mock, Trend, "ddd");
  assert.ok(!actual);
}

async function Select_By_Title() 
{
  const actual = await Query.Select_By_Title(db_mock, "React");
  const expected = "ccc";
  const msg = 'should match id ' + expected;
  assert.equal(actual.id, expected, msg);
}

async function Order_By()
{
  const d =
  [
    {
      "id": "-KqCQ9fPrqVJo_IaEU9d",
      "order": 19,
      "parent_id": "-M1iJTpFvdzFwzo3ua5x",
      "terms": "\"entity framework\"",
      "title": "Entity Framework",
      "parent_name": "Database"
    },
    {
      "id": "-KqCQrLgeH465nDyl2I8",
      "order": 20,
      "parent_id": "-M1iJTpFvdzFwzo3ua5x",
      "terms": "linq",
      "title": "Linq",
      "parent_name": "Database"
    },
    {
      "id": "-M2AynhHv9dQop_AnRgx",
      "parent_id": "-M1iJTpFvdzFwzo3ua5x",
      "terms": "sql",
      "title": "SQL",
      "parent_name": "Database"
    },
    {
      "id": "-M2B-FHd1Uzfbxux4kpB",
      "parent_id": "-M1iJTpFvdzFwzo3ua5x",
      "terms": "mongodb",
      "title": "MongoDb",
      "parent_name": "Database"
    },
    {
      "id": "-NfK1a4_SfKfqkAqhpBQ",
      "parent_id": "-M1iJTpFvdzFwzo3ua5x",
      "terms": "mariadb",
      "title": "MariaDB",
      "parent_name": "Database"
    },
    {
      "id": "-NfxpEbvXBH4plMMeeyc",
      "parent_id": "-M1iJTpFvdzFwzo3ua5x",
      "terms": "dynamodb",
      "title": "DynamoDB",
      "parent_name": "Database"
    },
    {
      "id": "-NfxpYXMO0rbXL4aOWcJ",
      "parent_id": "-M1iJTpFvdzFwzo3ua5x",
      "terms": "redis",
      "title": "Redis",
      "parent_name": "Database"
    }
  ];
  const o = 
  [
    {
      "code": "ORDERBY_ORDER",
      "dir": "asc"
    },
    {
      "code": "ORDERBY_TITLE",
      "dir": "asc"
    }
  ];
  await Query.Order_By(db, o, d)
  //const expected = "-KpPWAFGBhe6CxLYn22r";
  const msg = 'should match title';
  assert.equal(d[0].title, "Entity Framework", msg);
  assert.equal(d[1].title, "Linq", msg);
  assert.equal(d[2].title, "DynamoDB", msg);
  assert.equal(d[3].title, "MariaDB", msg);
}

async function Select_As_Options()
{
  const actual = await Query.Select_As_Options(db_mock, Trend);
  assert.ok(actual);
  assert.equal(actual.length, 3);
  assert.equal(actual[0].value, "ccc");
  assert.equal(actual[1].value, "ddd");
  assert.equal(actual[2].value, "eee");
  assert.equal(actual[0].text, "React");
  assert.equal(actual[1].text, "Angular");
  assert.equal(actual[2].text, "Vue");
}
