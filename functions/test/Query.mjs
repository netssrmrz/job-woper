import assert from "assert";
import firebase from 'firebase-admin';
import Db_Realtime from "../tb/Db_Realtime.mjs"
import Query from "../tb/query.js"
import config from './config.mjs';

let db = null, fb_app = null;

describe('class Query', Query_Tests);

function Query_Tests() 
{
  this.timeout(5000);
  before(Init);

  it('Select_By_Title', Select_By_Title);
  it('Order_By', Order_By);
  //it('Select_As_Options', Select_As_Options);

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

async function Select_By_Title() 
{
  const actual = await Query.Select_By_Title(db, "Polymer");
  const expected = "-KpPWAFGBhe6CxLYn22r";
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
  const actual = await Query.Select_As_Options(db);
  const expected = "-KpPWAFGBhe6CxLYn22r";
  const msg = 'should match id ' + expected;
  assert.equal(actual.id, expected, msg);
}