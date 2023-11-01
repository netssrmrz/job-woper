import Utils from '../../tb/Utils.js';

const db_mock = 
{
  last_id: 0,
  tag: "new_",
  data:
  {
    "query":
    {
      "ccc":
      {
        id: "ccc",
        title: "React",
        terms: "react",
        order: null,
        parent_id: null,
      },
      "ddd":
      {
        id: "ddd",
        title: "Angular",
        terms: "angular",
        order: null,
        parent_id: null,
      }
    },
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

  Save: function(table_name, obj)
  {
    this.Insert(table_name, obj);

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
  },

  Insert(table_name, obj)
  {
    ++this.last_id;
    obj.id = this.tag + this.last_id;
    this.data[table_name][obj.id] = obj;

    return obj.id;
  },

  Get_New_Ids(table_name)
  {
    const ids = Object.keys(db_mock.data[table_name]);
    const new_ids = ids.filter(id => id.startsWith("new_"));  

    return new_ids;
  }
};

export default db_mock;