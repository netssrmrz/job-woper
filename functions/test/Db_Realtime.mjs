import assert from "assert";
import firebase from 'firebase-admin';
import Db_Realtime from "../tb/Db_Realtime.mjs"
import config from './config.mjs';
import queries from './data/queries.mjs';

let db = null, fb_app = null;

describe('class Db_Realtime', Db_Realtime_Tests);

function Db_Realtime_Tests() 
{
  this.timeout(5000);
  before(Init);

  it('Select_Obj', Select_Obj);
  it('Select_Obj_By_Id', Select_Obj_By_Id);
  it('Select_Objs', Select_Objs);
  it('Select_Value_By_Id', Select_Value_By_Id);
  it('Select_Query', Select_Query);
  it('Order_By', Order_By);

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

async function Select_Obj() 
{
  let msg = 'should return matching trend object';
  let expected = {count: 8235, datetime: 1501474232081, 
    id: '-KqLpdR5VnvgbIOBpfFL', query_id: '-KpXaq_9Y_gdfEalxOmu'};
  let actual = await db.Select_Obj("trend/-KqLpdR5VnvgbIOBpfFL");
  assert.deepEqual(actual, expected, msg);

  msg = 'should return matching query object';
  expected = "-KpXaq_9Y_gdfEalxOmu";
  const where = [{field:"title",op:"equalTo",value:"Angular"}];
  actual = await db.Select_Obj("query", where);
  assert.deepEqual(actual.id, expected, msg);
}

async function Select_Obj_By_Id() 
{
  let msg = 'should return matching trend object';
  let expected = {count: 8235, datetime: 1501474232081, 
    id: '-KqLpdR5VnvgbIOBpfFL', query_id: '-KpXaq_9Y_gdfEalxOmu'};
  let actual = await db.Select_Obj_By_Id("trend", "-KqLpdR5VnvgbIOBpfFL");
  assert.deepEqual(actual, expected, msg);
}

async function Select_Objs() 
{
  let objs = await db.Select_Objs("query");
  let msg = 'should return objects';
  assert.equal(objs != null, true, msg);
  msg = 'should return multiple objects';
  assert.equal(objs.length > 0, true, msg);

  objs = await db.Select_Objs("query", null, "title");
  assert.equal(objs != null, true);
  assert.equal(objs.length > 0, true);
  assert.equal(objs[0].title, "AWS");
  assert.equal(objs[1].title, "Android");
  assert.equal(objs[2].title, "Angular");
}

async function Select_Value_By_Id() 
{
  let msg = 'should return matching trend count';
  let expected = 8235;
  let actual = await db.Select_Value_By_Id("count", "trend", "-KqLpdR5VnvgbIOBpfFL");
  assert.deepEqual(actual, expected, msg);
}

async function Select_Query() 
{
  let msg = 'should return a list of queries';
  let actual = await db.Select_Query("query");
  actual = Db_Realtime.To_Array(actual);
  assert.deepEqual(actual.length > 0, true, msg);

  msg = 'should return a single query';
  let expected = "Polymer";
  actual = await db.Select_Query("query/-KpPWAFGBhe6CxLYn22r");
  actual = actual.val();
  assert.deepEqual(actual.title, expected, msg);

  msg = 'should return a single item array';
  const where = [{field:"title",op:"equalTo",value:"Angular"}];
  actual = await db.Select_Query("query", where);
  actual = Db_Realtime.To_Array(actual);
  assert.deepEqual(actual.length == 1, true, msg);
}

function Order_By() 
{
  let msg = 'should match title';

  const order_by_title = [ { field: 'title', dir: 'asc' } ];
  let actual = db.Order_By(queries, order_by_title);
  assert.equal(actual[0].title, "AWS", msg);
  assert.equal(actual[1].title, "Android", msg);
  assert.equal(actual[2].title, "Angular", msg);

  const order_by_title_ignore_case = [ { field: 'title', dir: 'asc', ignore_case: true } ];
  actual = db.Order_By(queries, order_by_title_ignore_case);
  assert.equal(actual[0].title, "Android", msg);
  assert.equal(actual[1].title, "Angular", msg);
  assert.equal(actual[2].title, "Aurelia", msg);

  const d3 =
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
  const o3 = 
  [
    {
      "code": "ORDERBY_ORDER",
      "dir": "asc"
    },
    {
      "code": "ORDERBY_PARENT",
      "dir": "asc"
    }
  ];
  //actual = db.Order_By(d3, o3);
  //console.log("actual =", actual);
  //assert.equal(actual[0].title, "aaa", msg);
  //assert.equal(actual[1].title, "bbb", msg);
  //assert.equal(actual[2].title, "aaa", msg);
  //assert.equal(actual[3].title, "bbb", msg);
}
