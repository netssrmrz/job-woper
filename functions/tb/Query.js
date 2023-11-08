import Utils from './Utils.js';

class Query
{
  static table = "query";

  constructor()
  {
    this.id = null;
    this.title = null;
    this.terms = null;
    this.order = null;
    this.parent_id = null;
  }

  static async Select_Filters(db, filters)
  {
    let objs = await db.Select_Objs(Query.table);

    // db class filters
    const where = db.To_Db_Where(filters,
    [
      {code: "WHERE_ID",    field: "id",        op: "contains"},
      {code: "WHERE_TITLE", field: "title",     op: "contains"},
      {code: "WHERE_TERMS", field: "terms",     op: "contains"},
      {code: "WHERE_QUERY", field: "parent_id", op: "=="},
      {code: "WHERE_ORDER", field: "order",     op: ">="},
    ]);
    objs = db.Where(objs, where);

    return objs;
  }

  static async Order_By(db, order_by, objs, Trend)
  {
    //console.log("Query.Order_By(): order_by =", order_by);
    //console.log("Query.Order_By(): objs =", objs);

    if (order_by?.some(o => o.code == "ORDERBY_PARENT"))
    {
      await Utils.Calc_Values
        (objs, "parent_name", o => Query.Get_Title(db, o.parent_id));
    }
    if (order_by?.some(o => o.code == "ORDERBY_LAST"))
    {
      await Utils.Calc_Values
        (objs, "last_date", o => Trend.Select_Last_Date(db, o.id));
    }

    const db_order_by = db.To_Db_Order_By(order_by, 
    [
      {code: "ORDERBY_TITLE",  field: "title", ignore_case: true},
      {code: "ORDERBY_PARENT", field: "parent_name", ignore_case: true},
      {code: "ORDERBY_ORDER",  field: "order"},
      {code: "ORDERBY_LAST",   field: "last_date"},
    ]);
    db.Order_By(objs, db_order_by);
  }

  static async Select_All(db, Trend, where, order_by)
  {
    //console.log("Query.Select_All(): order_by =", order_by);

    const objs = await Query.Select_Filters(db, where);
    await Query.Order_By(db, order_by, objs, Trend);

    return objs;
  }

  static async Select_Count(db)
  {
    const objs = await Query.Select_All(db);
    return objs ? objs.length : 0;
  }

  static Get_Title(db, id)
  {
    return db.Select_Value_By_Id("title", Query.table, id);
  }

  static async Select_By_Title(db, title)
  {
    const where = [{field: "title", op: "equalTo", value: title}];
    return db.Select_Obj(Query.table, where);
  }

  static async Select_Children_By_Id(db, id)
  {
    // should apply caching
    const where = [{field: "parent_id", op: "equalTo", value: id}];
    let queries = await db.Select_Objs(Query.table, where);
    if (!Utils.isEmpty(queries))
    {
      queries.sort(Query.Compare_Order);
    }

    return queries;
  }

  static Select_By_Id(db, id)
  {
    return db.Select_Obj_By_Id(Query.table, id);
  }

  static async Select_As_Options(db, Trend)
  {
    let options = null;

    const order_by = [{code: "ORDERBY_TITLE", dir: "asc"}];
    const items = await Query.Select_All(db, Trend, null, order_by);
    if (!Utils.isEmpty(items))
    {
      options = items.map(item => {return {value: item.id, text: item.title}});
    }

    return options;
  }

  static Save(db, query)
  {
    return db.Save(Query.table, query);
  }

  static Delete(db, id)
  {
    return db.Delete(Query.table, id);
  }

  static async Insert_All(db, Trend, Jobs)
  {
    const queries = await Query.Select_All(db);
    console.log("Query.Insert_All: " + queries.length + " queries to process");
    for (const query of queries)
    {
      console.log("Query.Insert_All: query = " + JSON.stringify(query));
      if (!Utils.isEmpty(query.terms))
      {
        const has_data_today = await Query.Has_Data_Today(db, Trend, query.id);
        if (!has_data_today)
        {
          const insert_ok = await Trend.Insert_By_Query(db, Jobs, query);
          if (insert_ok)
          {
            console.log("Query.Insert_All: Query \"" + query.title + "\" updated");
          }
        }
        else
        {
          console.log("Query.Insert_All: Query \"" + query.title + "\" skipped due to existing data");
        }
      }
      else
      {
        console.log("Query.Insert_All: Query \"" + query.title + "\" skipped due to missing query string");
      }
    }
    console.log("Query.Insert_All: \"" + queries.length + "\" queries processed");
  }

  static async Has_Data_Today(db, Trend, id)
  {
    let res = null;

    const last_time = await Trend.Select_Last_Date(db, id);
    if (last_time)
    {
      const last_date = new Date(last_time);
      const today = new Date();
      res = today.toDateString() == last_date.toDateString();
    }

    return res;
  }

  // legacy =============================================================================

  static async Select_Objs(db)
  {
    var key, objs;

    key = "Query-Select_Objs";
    objs = await db.Get_From_Cache(key);
    if (objs.not_in_cache)
    {
      objs = await db.Select_Objs_Async("/query");
      if (objs)
      {
        objs.sort(Query.Compare_Order);
      }
  
      await db.Insert_In_Cache(key, objs);
    }

    return objs;
  }

  static Select_Objs_No_Cache(db, on_success_fn)
  {
    db.Select_Objs("/query", Select_OK);
    function Select_OK(objs)
    {
      if (objs)
      {
        objs.sort(Compare_Order);
      }
      on_success_fn(objs);
    }
  }

  static Compare_Order(a, b)
  {
    var res;

    if (a.order && !b.order)
      res = -1;
    else if (!a.order && b.order)
      res = 1;
    else if (!a.order && !b.order)
      res = 0;
    else if (a.order < b.order)
      res = -1;
    else if (a.order > b.order)
      res = 1;
    else
      res = 0;

    return res;
  }

  static Select_Obj_Async(db, id)
  {
    return db.Select_Obj_Async("/query/" + id);
  }

  static Delete_Trend_Data(db, query_id, on_success_fn)
  {
    Trend.Select_By_Query_Id(db, query_id, Select_OK);
    function Select_OK(items)
    {
      var c, todo, item;

      if (!Util.Empty(items))
      {
        todo = items.length;
        for (c = 0; c < items.length; c++)
        {
          item = items[c];
          Trend.Delete(db, item.id, Delete_OK);
          function Delete_OK()
          {
            todo--;
            if (todo == 0 && on_success_fn != null)
              on_success_fn();
          }
        }
      }
    }
  }

  static Insert_Trend(db, query, on_success_fn)
  {
    Indeed.Get_Job_Count(query.terms, Get_Job_Count_OK);
    function Get_Job_Count_OK(count)
    {
      var trend;

      trend = new Trend();
      trend.query_id = query.id;
      trend.datetime = Date.now();
      trend.count = count;
      trend.Insert(db, Insert_OK);
      function Insert_OK()
      {
        Trend.Calc_Chart_Vals_By_Query(db, query, Calc_OK);
        function Calc_OK(vals)
        {
          var key = "Select_Chart_Vals_By_Query_" + query.id;
          db.Insert_In_Cache2(key, vals, Cache_Insert_OK);
          function Cache_Insert_OK()
          {
            on_success_fn(query, trend, vals);
          }
        }
      }
    }
  }

  static async Insert_Trend_Async(db, query)
  {
    let res = null;

    //const count = await Indeed.Get_Job_Count_Async(query.terms);
    //const count = await Indeed.Get_Job_Count_By_Scrape(query.terms);
    const count = await Indeed.Get_Job_Count_By_Zenrows_Scrape(query.terms);
    if (count)
    {
      const trend = new Trend();
      trend.query_id = query.id;
      trend.datetime = Date.now();
      trend.count = count;
      await trend.Insert_Async(db);
  
      const vals = await Trend.Calc_Chart_Vals_By_Query_Async(db, query);
      const key = "Trend-Select_Chart_Vals_By_Query_" + query.id;
      await db.Insert_In_Cache(key, vals);
      res = {trend, vals};
    }

    return res;
  }

  static Insert_Trends(db, on_success_fn)
  {
    Query.Select_Objs_No_Cache(db, Select_Objs_OK);
    function Select_Objs_OK(queries)
    {
      var c, todo = queries.length, query;

      for (c = 0; c < queries.length; c++)
      {
        query = queries[c];
        if (!Util.Empty(query.terms))
        {
          Query.Insert_Trend(db, query, Insert_From_Query_OK);
          function Insert_From_Query_OK(query, trend, vals)
          {
            console.log("Query.Insert_Trends: Query \""+query.title+"\" updated with new value \""+trend.count+"\" for a total of "+vals.length+" values");
            todo--;
            if (todo == 0 && on_success_fn != null)
              on_success_fn();
          }
        }
        else
        {
          console.log("Query.Insert_Trends: Query \""+query.title+"\" skipped due to missing query string");
        }
      }
    }
  }

  // start here
  static async Insert_Trends_Async(db)
  {
    var c, query;

    const queries = await Query.Select_Objs(db);
    console.log("Query.Insert_Trends_Async: "+queries.length+" queries to process");
    for (c = 0; c < queries.length; c++)
    {
      query = queries[c];
      console.log("Query.Insert_Trends_Async: query = "+JSON.stringify(query));
      if (!Util.Empty(query.terms))
      {
        const trend_info = await Query.Insert_Trend_Async(db, query);
        if (trend_info)
        {
          console.log("Query.Insert_Trends_Async: Query \""+query.title+"\" updated with new value \""+
          trend_info.trend.count+"\" for a total of "+trend_info.vals.length+" values");
        }
      }
      else
      {
        console.log("Query.Insert_Trends_Async: Query \""+query.title+"\" skipped due to missing query string");
      }
    }
  }
  
  static Has_Children(db, query, on_success_fn)
  {
    var ref;

    ref = db.conn.ref("query");
    ref = ref.orderByChild("parent_id");
    ref = ref.equalTo(query.id);
    ref = ref.limitToFirst(1);
    ref.once('value').then(If_Have_Data);
    function If_Have_Data(query_res)
    {
      var child_query, res = false;

      child_query = Db.To_Obj(query_res);
      if (child_query)
      {
        res = true;
      }

      on_success_fn(query, res);
    }
  }
}

export default Query;