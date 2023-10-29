import assert from "assert";
import firebase from 'firebase-admin';
import Db_Realtime from "../tb/Db_Realtime.mjs"
import Trend from "../tb/trend.js"
import config from './config.mjs';
import trend_data from "./data/trends.mjs";
import Utils from "../tb/Utils.js";

let db = null, fb_app = null;

describe('class Trend', Trend_Tests);

function Init()
{
  const app_config =
  {
    credential: firebase.credential.cert(config),
    databaseURL: "https://job-woper-default-rtdb.asia-southeast1.firebasedatabase.app/",
  };
  fb_app = firebase.initializeApp(app_config);
  const fb_db = firebase.database();
  db = new Db_Realtime(fb_db);
}

function Cleanup()
{
  fb_app.delete();
}

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
  it('Months_In_Range', Months_In_Range);
  it('Interpolate', Interpolate);
  it('Insert_Interpolation', Insert_Interpolation);
  it('Get_Stats', Get_Stats);
  it('Get_Prev_Month_Entry', Get_Prev_Month_Entry);
  it('Select_Stats_By_Query_Ids', Select_Stats_By_Query_Ids);

  after(Cleanup);
}

async function Select_Stats_By_Query_Ids()
{
  let actual = await Trend.Select_Stats_By_Query_Ids(db_mock);
  assert.ok(actual);
  assert.equal(actual[0].last_entry.id, "ddd");
  assert.equal(actual[0].prev_entry.id, "ccc");
  assert.equal(actual[0].prev_month_entry.id, "aaa");
  assert.equal(actual[0].first_entry.id, "bbb");
  assert.equal(actual[0].num_entries, 5);

  actual = await Trend.Select_Stats_By_Query_Ids(db_mock, ["ccc", "ddd", "eee"]);
  assert.ok(actual);
  assert.equal(actual.length, 3);
  assert.equal(actual[0].last_entry.id, "ddd");
  assert.equal(actual[0].prev_entry.id, "ccc");
  assert.equal(actual[0].prev_month_entry.id, "aaa");
  assert.equal(actual[0].first_entry.id, "bbb");
  assert.equal(actual[0].num_entries, 4);
  assert.equal(actual[1].last_entry.id, "eee");
  assert.equal(actual[1].prev_entry.id, "eee");
  assert.equal(actual[1].prev_month_entry.id, "eee");
  assert.equal(actual[1].first_entry.id, "eee");
  assert.equal(actual[1].num_entries, 1);
  assert.equal(actual[2], null);
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
  [
    {
      id: '123',
      items:
      [ 
        { datetime: 123, count: 1, query_id: "-KpXaq_9Y_gdfEalxOmu" }, 
        { datetime: 123, count: 2, query_id: "-KpXaq_9Y_gdfEalxOmu" } 
      ]
    },
    {
      id: '279',
      items: 
      [ 
        { datetime: 222, count: 3, query_id: "-KpXaq_9Y_gdfEalxOmu" }, 
        { datetime: 234, count: 4, query_id: "-KpXaq_9Y_gdfEalxOmu" } 
      ]
    },
    {
      id: '357',
      items:
      [ 
        { datetime: 333, count: 5, query_id: "-KpXaq_9Y_gdfEalxOmu" } 
      ]
    },
    {
      id: '513',
      items: 
      [
        { datetime: 444, count: 6, query_id: "-KpXaq_9Y_gdfEalxOmu" },
        { datetime: 513, count: 7, query_id: "-KpXaq_9Y_gdfEalxOmu" },
        { datetime: 513, count: 8, query_id: "-KpXaq_9Y_gdfEalxOmu" },
        { datetime: 511, count: 9, query_id: "-KpXaq_9Y_gdfEalxOmu" },
        { datetime: 456, count: 10, query_id: "-KpXaq_9Y_gdfEalxOmu" }
      ]
    }
  ];
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
  [
    {
      id: '123',
      items:
      [ 
        { datetime: 123, count: 1, query_id: "-KpXaq_9Y_gdfEalxOmu" }, 
        { datetime: 123, count: 2, query_id: "-KpPWAFGBhe6CxLYn22r" } 
      ]
    },
    {
      id: '279',
      items:
      [ 
        { datetime: 222, count: 3, query_id: "-KpXaq_9Y_gdfEalxOmu" }, 
        { datetime: 234, count: 4, query_id: "-KpXaq_9Y_gdfEalxOmu" } 
      ]
    },
    {
      id: '357',
      items:
      [ 
        { datetime: 333, count: 5, query_id: "-KpPWAFGBhe6CxLYn22r" } 
      ]
    },
    {
      id: '513',
      items:
      [
        { datetime: 444, count: 6, query_id: "-KpXaq_9Y_gdfEalxOmu" },
        { datetime: 513, count: 7, query_id: "-KpXaq_9Y_gdfEalxOmu" },
        { datetime: 513, count: 8, query_id: "-KpXaq_9Y_gdfEalxOmu" },
        { datetime: 511, count: 9, query_id: "-KpPWAFGBhe6CxLYn22r" },
        { datetime: 456, count: 10, query_id: "-KpPWAFGBhe6CxLYn22r" }
      ]
    }
  ];
  
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

function Months_In_Range()
{
  let from_time = (new Date(1971, 10, 13)).getTime();
  let to_time = (new Date(1972, 10, 13)).getTime();
  let expected =
  [
    (new Date(1971, 11, 13)).getTime(),
    (new Date(1972, 0, 13)).getTime(),
    (new Date(1972, 1, 13)).getTime(),
    (new Date(1972, 2, 13)).getTime(),
    (new Date(1972, 3, 13)).getTime(),
    (new Date(1972, 4, 13)).getTime(),
    (new Date(1972, 5, 13)).getTime(),
    (new Date(1972, 6, 13)).getTime(),
    (new Date(1972, 7, 13)).getTime(),
    (new Date(1972, 8, 13)).getTime(),
    (new Date(1972, 9, 13)).getTime(),
  ];

  let actual = Trend.Months_In_Range(from_time, to_time);
  assert.equal(actual.length, 11);
  assert.deepEqual(actual, expected);
}

function Interpolate()
{
  let from_entry =
  {
    id: "aaa",
    query_id: "ccc",
    datetime: (new Date(2022, 0, 1)).getTime(),
    count: 0,
  };
  let to_entry =
  {
    id: "bbb",
    query_id: "ccc",
    datetime: (new Date(2022, 11, 1)).getTime(),
    count: 100,
  };
  let query_id = "ccc", error = 50;
  let actual = Trend.Interpolate(from_entry, to_entry, query_id, error);
  assert.equal(actual.length, 10);
  let min_count = from_entry.count - error;
  let max_count = to_entry.count + error;
  for (const trend of actual)
  {
    assert.equal(trend.id, null);
    assert.equal(trend.query_id, query_id);
    assert.ok(trend.datetime > from_entry.datetime && trend.datetime < to_entry.datetime);
    assert.ok
    (
      trend.count >= min_count && trend.count < max_count,
      `count=${trend.count} min_count=${min_count} max_count=${max_count}`
    );
  }

  from_entry =
  {
    id: "aaa",
    query_id: "ccc",
    datetime: (new Date(2022, 0, 1)).getTime(),
    count: 100,
  };
  to_entry =
  {
    id: "bbb",
    query_id: "ccc",
    datetime: (new Date(2022, 11, 1)).getTime(),
    count: 0,
  };
  query_id = "ccc", error = 50;
  actual = Trend.Interpolate(from_entry, to_entry, query_id, error);
  assert.equal(actual.length, 10);
  min_count = to_entry.count - error;
  max_count = from_entry.count + error;
  for (const trend of actual)
  {
    assert.equal(trend.id, null);
    assert.equal(trend.query_id, query_id);
    assert.ok(trend.datetime > from_entry.datetime && trend.datetime < to_entry.datetime);
    assert.ok
    (
      trend.count >= min_count && trend.count < max_count,
      `count=${trend.count} min_count=${min_count} max_count=${max_count}`
    );
  }

}

async function Insert_Interpolation()
{
  db_mock.tag = "ii1_";
  let from_id = "aaa", to_id = "bbb", query_id = "ccc", error = 50;
  let actual = await Trend.Insert_Interpolation(db_mock, from_id, to_id, query_id, error);
  let mock_trends = db_mock.data[Trend.table];
  let mock_ids = Object.keys(mock_trends);
  let new_ids = mock_ids.filter(id => id.startsWith("ii1_"));
  assert.ok(actual);
  assert.equal(new_ids.length, 10);
  const from_entry = mock_trends[from_id];
  const to_entry = mock_trends[to_id];
  let min_count = from_entry.count - error;
  let max_count = to_entry.count + error;
  for (const new_id of new_ids)
  {
    const trend = mock_trends[new_id];
    assert.equal(trend.id, new_id);
    assert.equal(trend.query_id, query_id);
    assert.ok(trend.datetime > from_entry.datetime && trend.datetime < to_entry.datetime);
    assert.ok
    (
      trend.count >= min_count && trend.count < max_count,
      `count=${trend.count} min_count=${min_count} max_count=${max_count}`
    );
  }
}

function Get_Prev_Month_Entry()
{
  let actual = Trend.Get_Prev_Month_Entry(null);
  assert.equal(actual, null);

  actual = Trend.Get_Prev_Month_Entry([]);
  assert.equal(actual, null);

  const one_trend =
  [
    {
      id: 0,
      query_id: "aaa",
      datetime: (new Date(2022, 0, 1)).getTime(),
      count: 100,
    },
  ];
  actual = Trend.Get_Prev_Month_Entry(one_trend);
  assert.equal(actual, one_trend[0]);

  const no_month_trends =
  [
    {
      id: 0,
      query_id: "aaa",
      datetime: Date.now() - Utils.MILLIS_DAY,
      count: 100,
    },
    {
      id: 1,
      query_id: "aaa",
      datetime: Date.now(),
      count: 100,
    },
  ];
  actual = Trend.Get_Prev_Month_Entry(no_month_trends);
  assert.equal(actual, no_month_trends[0]);

  const month_trends =
  [
    {
      id: 0,
      query_id: "aaa",
      datetime: Date.now() - Utils.MILLIS_YEAR,
      count: 200,
    },
    {
      id: 1,
      query_id: "aaa",
      datetime: Date.now(),
      count: 100,
    },
  ];
  actual = Trend.Get_Prev_Month_Entry(month_trends);
  assert.equal(actual, month_trends[0]);

  const month_3_trends =
  [
    {
      id: 0,
      query_id: "aaa",
      datetime: Date.now() - Utils.MILLIS_YEAR,
      count: 200,
    },
    {
      id: 1,
      query_id: "aaa",
      datetime: Date.now() - Utils.MILLIS_MONTH * 2,
      count: 100,
    },
    {
      id: 2,
      query_id: "aaa",
      datetime: Date.now(),
      count: 100,
    },
  ];
  actual = Trend.Get_Prev_Month_Entry(month_3_trends);
  assert.equal(actual, month_3_trends[1]);

  const month_4_trends =
  [
    {
      id: 0,
      query_id: "aaa",
      datetime: Date.now() - Utils.MILLIS_YEAR,
      count: 200,
    },
    {
      id: 1,
      query_id: "aaa",
      datetime: Date.now() - Utils.MILLIS_MONTH * 2,
      count: 100,
    },
    {
      id: 2,
      query_id: "aaa",
      datetime: Date.now() - Utils.MILLIS_WEEK,
      count: 100,
    },
    {
      id: 3,
      query_id: "aaa",
      datetime: Date.now(),
      count: 100,
    },
  ];
  actual = Trend.Get_Prev_Month_Entry(month_4_trends);
  assert.equal(actual, month_4_trends[1]);
}

function Get_Stats()
{
  let actual = Trend.Get_Stats(null);
  assert.equal(actual, null);

  actual = Trend.Get_Stats([]);
  assert.equal(actual, null);

  const trends =
  [
    {
      id: 0,
      query_id: "aaa",
      datetime: (new Date(2022, 0, 1)).getTime(),
      count: 100,
    },
    {
      id: 1,
      query_id: "aaa",
      datetime: (new Date(2021, 0, 1)).getTime(),
      count: 400,
    },
    {
      id: 2,
      query_id: "aaa",
      datetime: (new Date(2019, 0, 1)).getTime(),
      count: 300,
    },
    {
      id: 3,
      query_id: "aaa",
      datetime: (new Date(2020, 0, 1)).getTime(),
      count: 200,
    },
  ];

  actual = Trend.Get_Stats(trends);
  assert.ok(actual != null);
  assert.equal(actual.last_entry, trends.find(t => t.id == 0));
  assert.equal(actual.prev_entry, trends.find(t => t.id == 1));
  assert.equal(actual.prev_month_entry, trends.find(t => t.id == 1));
  assert.equal(actual.first_entry, trends.find(t => t.id == 2));
  assert.equal(actual.num_entries, 4);
}

const db_mock = 
{
  last_id: 0,
  tag: "new_",
  data:
  {
    "trend": 
    {
      "aaa":
      {
        id: "aaa",
        query_id: "ccc",
        datetime: (new Date(2022, 0, 1)).getTime(),
        count: 0,
      },
      "bbb": 
      {
        id: "bbb",
        query_id: "ccc",
        datetime: (new Date(1971, 10, 13)).getTime(),
        count: 100,
      },
      "ccc": 
      {
        id: "ccc",
        query_id: "ccc",
        datetime: Date.now() - Utils.MILLIS_WEEK,
        count: 200,
      },
      "eee": 
      {
        id: "eee",
        query_id: "ddd",
        datetime: Date.now() - Utils.MILLIS_WEEK * 2,
        count: 200,
      },
      "ddd": 
      {
        id: "ddd",
        query_id: "ccc",
        datetime: Date.now(),
        count: 300,
      },
    }
  },

  To_Db_Order_By: function()
  {

  },

  Order_By: function()
  {

  },

  To_Db_Where: function()
  {

  },

  Where: function(objs, where)
  {
    return objs;
  },

  Select_Objs: function(table_name, where)
  {
    // const where = [{ field:"query_id", op:"equalTo", value:query_id }];
    const objs = this.data[table_name];
    const obj_array = Object.keys(objs).map(k => objs[k]);
    const res = this.Where(obj_array, where);

    return res;
  },

  Select_Obj_By_Id: function(table_name, id)
  {
    return this.data[table_name][id];
  },

  Save: function(table_name, trend)
  {
    ++this.last_id;
    trend.id = this.tag + this.last_id;
    this.data[table_name][trend.id] = trend;
    return true;
  },

  Get_Field_Value: function(obj, where, def_value)
  {
    let value = null;

    if (obj && where)
    {
      if (where.field_fn)
      {
        value = where.field_fn(obj);
      }
      else if (where.field)
      {
        value = obj[where.field];
      }
    }

    return value || def_value;
  },

  Where: function(data, wheres)
  {
    let res = data;

    if (!Utils.isEmpty(data) && !Utils.isEmpty(wheres))
    {
      for (const where of wheres)
      {
        if (where.op == "array-contains")
        {
          res = res.filter(o => this.Get_Field_Value(o, where, []).includes(where.value));
        }
        if (where.op == "contains")
        {
          res = res.filter(o => this.Get_Field_Value(o, where, "").includes(where.value));
        }
        if (where.op == "!=")
        {
          res = res.filter(o => this.Get_Field_Value(o, where) != where.value);
        }
        if (where.op == "==" || where.op == "equalTo")
        {
          res = res.filter(o => this.Get_Field_Value(o, where) == where.value);
        }
        if (where.op == ">=")
        {
          res = res.filter(o => this.Get_Field_Value(o, where) >= where.value);
        }
        if (where.op == "<=")
        {
          res = res.filter(o => this.Get_Field_Value(o, where) <= where.value);
        }
        if (where.op == ">")
        {
          res = res.filter(o => this.Get_Field_Value(o, where) > where.value);
        }
        if (where.op == "<")
        {
          res = res.filter(o => this.Get_Field_Value(o, where) < where.value);
        }
        if (where.op == "filter-fn")
        {
          res = res.filter(o => this.Get_Field_Value(o, where));
        }
      }
    }

    return res;
  }
};
