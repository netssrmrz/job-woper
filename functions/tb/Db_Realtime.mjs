import Utils from "./Utils.js";

class Db_Realtime
{
  constructor(client)
  {
    this.client = client || null;
    this.error = null;
    this.read_only = false;
  }
  
  get db()
  {
    return this.client;
  }

  get last_error()
  {
    return this.error;
  }

  set last_error(e)
  {
    this.error = e;
    console.error(e);
  }
  
  // select =======================================================================================
  // where = [{field, op, value}]

  //async Select_Obj(classType, sql, params)
  //async Select_Obj(table_name, class_type, where)
  async Select_Obj(from, where)
  {
    //console.log("Db_Realtime.Select_Obj(): from =", from);

    let obj = null;

    const query_res = await this.Select_Query(from, where);
    if (where)
    {
      const objs = Db_Realtime.To_Array(query_res);
      obj = objs[0];
    }
    else
    {
      obj = query_res.val();
    }
      
    return obj;
  }

  async Select_Obj_By_Id(table_name, id)
  {
    //console.log("Db_Realtime.Select_Obj_By_Id(): table_name =", table_name);
    //console.log("Db_Realtime.Select_Obj_By_Id(): id =", id);

    let obj = null;

    if (!Utils.isEmpty(table_name) && !Utils.isEmpty(id))
    {
      const path = table_name + "/" + id;
      obj = await this.Select_Obj(path);
    }
      
    return obj;
  }

  async Select_Objs(from, where, order_by)
  {
    const query_res = await this.Select_Query(from, where, order_by);
    const objs = Db_Realtime.To_Array(query_res, where);
      
    return objs;
  }

  //async Select_Values(sql, params)
  async Select_Values(field_name, table_name, where, order_by)
  {
  }

  //async Select_Value(sql, params)
  async Select_Value(table_name, field_name, where)
  {
  }
  
  async Select_Value_By_Id(field_name, table_name, id)
  {
    //console.log("Db_Realtime.Select_Value_By_Id(): field_name =", field_name);
    //console.log("Db_Realtime.Select_Value_By_Id(): table_name =", table_name);
    //console.log("Db_Realtime.Select_Value_By_Id(): id =", id);

    const obj = await this.Select_Obj_By_Id(table_name, id);

    return obj ? obj[field_name]: null;
  }

  //async Select_Row(sql, params)
  async Select_Row(table_name, where)
  {
  }

  async Select_Row_By_Id(id, table_name)
  {
  }

  async Select_Rows(sql, params)
  {
  }

  async Select_Objs_By_Ids(from, ids)
  {
  }

  async Select(table_name, where, order_by, page)
  {
  }

  Select_Query(from, where, order_by, limit_to_first)
  {
    //console.log("Db_Realtime.Select_Query(): from, where =", from, where);
    //console.log("Db_Realtime.Select_Query(): order_by =", order_by);
    //console.log("Db_Realtime.Select_Query(): limit_to_first =", limit_to_first);

    let ref = this.client.ref(from);
    if (order_by)
    {
      ref = ref.orderByChild(order_by);
    }
    if (!Utils.isEmpty(where))
    {
      for (const filter of where)
      {
        if (filter.op == "equalTo")
        {
          ref = ref.orderByChild(filter.field);
          ref = ref.equalTo(filter.value);
        }
      }
    }
    if (limit_to_first)
    {
      ref = ref.limitToFirst(limit_to_first);
    }
    const query_res = ref.once('value');

    return query_res;
  }

  // save, insert, update =========================================================================

  async Insert(table_name, obj, on_success_fn)
  {
    let res = null;

    if (!this.read_only)
    {
      try
      {
        obj.id = this.client.ref(table_name).push().key;
        this.client.ref(table_name + "/" + obj.id).set(obj, on_success_fn);
        res = obj.id;
      }
      catch(error)
      {
        this.last_error = error;
      }
    }

    return res;
  }

  //Insert_Row(tableName, obj)
  async Insert_Row(data, table_name)
  {
  }

  async Insert_Rows(rows, table_name)
  {
  }

  Insert_Obj(obj, skipUndefined)
  {
  }

  async Insert_Objs(objs)
  {
  }

  async Update(table_name, obj, on_success_fn)
  {
    let res = null;

    if (!this.read_only)
    {
      try
      {
        this.client.ref(table_name + "/" + obj.id).set(obj, on_success_fn);
        res = obj.id;
      }
      catch(error)
      {
        this.last_error = error;
      }
    }

    return res;
  }

  async Update_Obj(obj, skipUndefined, where, params)
  {
  }

  Save(table_name, obj)
  {
    let res = null;

    if (obj.id)
    {
      res = this.Update(table_name, obj);
    }
    else
    {
      res = this.Insert(table_name, obj);
    }

    return res;
  }

  // delete =======================================================================================

  async Delete(table_name, id, on_success_fn)
  {
    let res = false;

    try
    {
      await this.client.ref(table_name + "/" + id).remove(on_success_fn);
      res = true;
    }
    catch(error)
    {
      this.last_error = error;
    }

    return res;
  }

  async Delete_Obj(obj)
  {
  }

  async Delete_Objs(table_name, objs)
  {
  }

  async Delete_By_Id(classType, id)
  {
  }

  async Delete_By_Ids(table_name, ids)
  {
    let res = false;
    const updates = {};

    for (const id of ids)
    {
      updates[id] = null;
    }

    try
    {
      this.client.ref(table_name).update(updates);
      res = true;
    }
    catch(error)
    {
      this.last_error = error;
    }

    return res;
  }

  async Delete_Where(table_name, where)
  {
  }

  // where, order by ==============================================================================

  Order_By(data, order_bys)
  {
    //console.log("Db_Realtime.Order_By(): data =", data);
    //console.log("Db_Realtime.Order_By(): order_bys =", order_bys);

    let res = data;

    if (!Utils.isEmpty(data) && !Utils.isEmpty(order_bys))
    {
      res = data.sort((a, b) => Compare(a, b, 0));

      function Compare(a, b, idx)
      {
        let res = 0;

        if (idx < order_bys.length)
        {
          const order_by = order_bys[idx];
          const compare_dir = order_by.dir == "asc" ? 1: -1;
          const value_a = Db_Realtime.Get_Order_By_Value(a, order_by);
          const value_b = Db_Realtime.Get_Order_By_Value(b, order_by);

          if (value_a == null && value_b != null) res = compare_dir;
          else if (value_b == null && value_a != null) res = -compare_dir;
          else if (value_a > value_b) res = compare_dir;
          else if (value_a < value_b) res = -compare_dir;
          else res = Compare(a, b, idx + 1);
        }

        return res;
      }
    }

    return res;
  }

  static Get_Order_By_Value(obj, spec)
  {
    let value = null;

    const field_value = obj[spec.field];
    if (field_value != undefined && field_value != null)
    {
      if (spec.ignore_case)
      {
        value = field_value.toLowerCase();
      }
      else
      {
        value = field_value;
      }
    }

    return value;
  }

  Add_Order_By(query, order_bys)
  {
    if (!Utils.isEmpty(order_bys))
    {
      for (const order_by of order_bys)
      {
        query = query.orderBy(order_by.field, order_by.dir);
      }
    }

    return query;
  }

  Where(data, wheres)
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
          const where_value = where.value.toLowerCase();
          res = res.filter(o => this.Get_Field_Value(o, where, "", true).includes(where_value));
        }
        if (where.op == "!=")
        {
          res = res.filter(o => this.Get_Field_Value(o, where) != where.value);
        }
        if (where.op == "==")
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

  Get_Field_Value(obj, where, def_value, to_lower_case)
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

      if (value && to_lower_case && value.toLowerCase)
      {
        value = value.toLowerCase();
      }
    }

    return value || def_value;
  }

  Add_Where(table, where_filters)
  {
    if (!Utils.isEmpty(where_filters))
    {
      for (const filter of where_filters)
      {
        table = table.where(filter.field, filter.op, filter.value);
      }
    }

    return table;
  }
  
  To_Db_Order_By(order_codes, order_bys)
  {
    let db_order_bys = null;

    if (!Utils.isEmpty(order_codes))
    {
      db_order_bys = [];

      for (const value of order_codes)
      {
        const order_code = value.code;
        const order_dir = value.dir == "desc" ? "desc": "asc";

        const order_by = order_bys.find(o => o.code == order_code);
        if (order_by)
        {
          const db_order_by = 
          {
            field: order_by.field, 
            dir: order_dir, 
            ignore_case: order_by.ignore_case
          };
          db_order_bys.push(db_order_by);
        }
      }
    }

    return db_order_bys;
  }
  
  To_Db_Where(values, conditions, extra_filters)
  {
    let db_where = [];

    if (!Utils.isEmpty(values))
    {
      for (const value_name in values)
      {
        const condition = conditions.find(c => c.code == value_name);
        if (condition)
        {
          let value = values[value_name];
          if (value || (condition.use_null && value == null))
          {
            value = condition.map_fn ? condition.map_fn(value): value;

            const filter = 
            {
              field: condition.field, 
              field_fn: condition.field_fn, 
              op: condition.op, value
            };
            db_where.push(filter);
          }
        }
      }
    }

    if (!Utils.isEmpty(extra_filters))
    {
      db_where.push(...extra_filters);
    }

    return Utils.nullIfEmpty(db_where);
  }

  // misc =========================================================================================
  
  Start_Transaction()
  {
  }

  Commit()
  {
  }

  async Count(table_name, where)
  {
  }

  async Exists(table_name, id)
  {
  }

  To_Obj(class_obj)
  {
  }

  To_Class(db_obj, class_type)
  {
  }

  static To_Array(query_res, where)
  {
    let vals = null;

    query_res.forEach(Process_Row);
    function Process_Row(row_snapshot)
    {
      if (vals == null) vals = new Array();
      const row_data = row_snapshot.val();

      let include = true;
      if (!Utils.isEmpty(where))
      {
        for (const filter of where)
        {
          const field_value = row_data[filter.field];
          if (filter.op == "in") include = include && filter.value.includes(field_value);
        }
      }
  
      if (include) vals.push(row_data);
    }
  
    return vals;
  }
}

export default Db_Realtime;
