//import Util from './init.js';
import Utils from './Utils.js';

class Trend
{
  static table = "trend";

  constructor()
  {
    this.id = null;
    this.query_id = null;
    this.datetime = null;
    this.count = null;
  }

  static async Select_Filters(db, filters)
  {
    let objs = await db.Select_Objs(Trend.table);

    // db class filters
    const where = db.To_Db_Where(filters,
    [
      {code: "WHERE_ID",    field: "id",       op: "contains"},
      {code: "WHERE_TIME",  field: "datetime", op: ">="},
      {code: "WHERE_QUERY", field: "query_id", op: "=="},
      {code: "WHERE_JOBS",  field: "count",    op: ">="},
    ]);
    objs = db.Where(objs, where);

    return objs;
  }

  static async Order_By(db, order_by, objs)
  {
    //console.log("Trend.Order_By(): order_by =", order_by);
    //console.log("Trend.Order_By(): objs =", objs);

    if (order_by?.some(o => o.code == "ORDERBY_QUERY"))
    {
      await Utils.Calc_Values
        (objs, "query_name", o => Trend.Get_Query_Title(db, o.parent_id));
    }

    const db_order_by = db.To_Db_Order_By(order_by, 
    [
      {code: "ORDERBY_DATETIME",  field: "datetime"},
      {code: "ORDERBY_COUNT", field: "count"},
      {code: "ORDERBY_QUERY",  field: "query_name"},
    ]);
    db.Order_By(objs, db_order_by);
  }

  static async Select_All(db, where, order_by)
  {
    //console.log("Trend.Select_All(): order_by =", order_by);

    const objs = await Trend.Select_Filters(db, where);
    await Trend.Order_By(db, order_by, objs);

    return objs;
  }

  static Get_Query_Title(db, query_id)
  {
    return db.Select_Value_By_Id("title", "query", query_id);
  }

  static async Select_Stats(db)
  {
    let res = null;

    const objs = await Trend.Select_All(db);
    if (!Utils.isEmpty(objs))
    {
      res =
      {
        count: objs.length,
        first_time: objs[0].datetime,
        last_time: objs[objs.length-1].datetime
      };
    }

    return res;
  }

  static async Select_By_Query_Id(db, query_id)
  {
    // should use cache
    const where = [{ field:"query_id", op:"equalTo", value:query_id }];
    return db.Select_Objs(Trend.table, where);
  }

  static async Select_Last_Val(db, query_id)
  {
    var vals, val = 0;

    vals = await Trend.Select_By_Query_Id(db, query_id);
    if (!Utils.isEmpty(vals))
    {
      vals = Utils.Sort(vals, "datetime");
      val = vals[vals.length - 1].count;
    }

    return val;
  }

  static async Select_Prev_Val(db, query_id)
  {
    var vals, val = 0;

    vals = await Trend.Select_By_Query_Id(db, query_id);
    if (!Utils.isEmpty(vals))
    {
      vals = Utils.Sort(vals, "datetime");
      if (vals.length == 1)
        val = vals[0].count;
      else
        val = vals[vals.length - 2].count;
    }

    return val;
  }

  static async Select_Prev_Month_Val(db, query_id)
  {
    var entries, val = 0, prev_entry, i;

    const millis_per_month = 1000 * 60 * 60 * 24 * 30;
    const month_start = Date.now() - millis_per_month;

    entries = await Trend.Select_By_Query_Id(db, query_id);
    if (!Utils.isEmpty(entries))
    {
      if (entries.length == 1)
        val = entries[0].count;
      else
      {
        for (i=entries.length-1; i>0; i--)
        {
          prev_entry = entries[i-1];
          if (prev_entry.datetime < month_start)
            break;
        }
        val = entries[i].count;
      }
    }

    return val;
  }

  static async Select_First(db, query_id)
  {
    var vals, res;

    vals = await Trend.Select_By_Query_Id(db, query_id);
    if (!Utils.isEmpty(vals))
    {
      vals = Utils.Sort(vals, "datetime");
      res = vals[0];
    }

    return res;
  }

  static async Select_Chart_Vals_By_Query(db, query)
  {
    let vals = null;
    const span_count = 100;

    const items = await Trend.Select_By_Query_Id(db, query.id);
    if (!Utils.isEmpty(items))
    {
      const groups = Utils.Group_By_Ceil_Span(items, "datetime", span_count);
      vals = Trend.To_Chart_Vals(groups, query.title);
    }

    return vals;
  }

  static To_Chart_Vals(groups, query_title)
  {
    let vals = null;

    if (!Utils.isEmpty(groups))
    {
      vals = [['Date', query_title]];
      for (const group_id in groups)
      {
        const items = groups[group_id];
        const item_count = items.length;
        const item_total = items.reduce((total, item) => total + item.count, 0);
        const item_avg = item_total / item_count;

        const val = [Math.trunc(Number(group_id)), item_avg];
        vals.push(val);
      }
    }

    return vals;
  }

  static async Insert_By_Query(db, Jobs, query)
  {
    let res = null;

    const count = await Jobs.Get_Job_Count(query.terms);
    if (count)
    {
      const trend = new Trend();
      trend.query_id = query.id;
      trend.datetime = Date.now();
      trend.count = count;
      res = db.Insert(Trend.table, trend);
      res = true;
    }

    return res;
  }

  static Delete(db, id)
  {
    return db.Delete(id);
  }

  static Delete_By_Ids(db, ids)
  {
    return db.Delete_By_Ids(Trend.table, ids);
  }

  // legacy =============================================================================

  static Select_By_Id(db, id)
  {
    return db.Select_Obj_By_Id(Trend.table, id);
  }

  Insert(db, on_success_fn)
  {
    db.Insert("/trend", this, on_success_fn);
  }

  Insert_Async(db)
  {
    return db.Insert("/trend", this);
  }

  Update(db, on_success_fn)
  {

  }

  static async Select_First_Val(db, query_id)
  {
    var vals, val = 0;

    vals = await Trend.Select_By_Query_Id_Async(db, query_id);
    if (!Util.Empty(vals))
    {
      vals = Util.Sort(vals, "datetime");
      val = vals[0].count;
    }

    return val;
  }
}

export default Trend;