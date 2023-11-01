import Utils from './Utils.js';

/** Class representing a job query data point */
class Trend
{
  static table = "trend";

  constructor()
  {
    this.id = null;
    this.query_id = null;
    this.datetime = null;
    this.count = null;
    this.is_interpolation = null;
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
        (objs, "query_name", o => Trend.Get_Query_Title(db, o.query_id));
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

  /**
   * Get statistics for each query id specified
   * @static
   * @param {Db} db - Database object
   * @param {string[]} query_ids - Array of query IDs
   * @returns {Stats[]}
   */
  static async Select_Stats_By_Query_Ids(db, query_ids)
  {
    let res = null;

    if (!Utils.isEmpty(query_ids))
    {
      res = [];
      for (const query_id of query_ids)
      {
        const entries = await Trend.Select_By_Query_Id(db, query_id);
        const stats = Trend.Get_Stats(entries);
        stats.title = await Trend.Get_Query_Title(db, query_id);
        res.push(stats);
      }
    }
    else
    {
      const entries = await Trend.Select_All(db);
      const stats = Trend.Get_Stats(entries);
      res = [stats];
    }

    return res;
  }

  static async Select_By_Query_Id(db, query_id)
  {
    // should use cache
    const where = [{ field:"query_id", op:"equalTo", value:query_id }];
    return db.Select_Objs(Trend.table, where);
  }

  static async Select_By_Query_Ids(db, query_ids)
  {
    // should use cache
    const where = [{ field:"query_id", op:"in", value:query_ids }];
    return db.Select_Objs(Trend.table, where);
  }

  /**
   * Get Trend objects used to display trend statistics
   * @static
   * @param {Entry[]} entries - Array of Trend objects
   * @returns {Stats}
   */
  static Get_Stats(entries)
  {
    let stats = null;

    if (!Utils.isEmpty(entries))
    {
      entries = Utils.Sort(entries, "datetime");

      stats =
      {
        last_entry: entries[entries.length - 1],
        prev_entry: entries.length == 1 ? entries[0] : entries[entries.length - 2],
        prev_month_entry: Trend.Get_Prev_Month_Entry(entries),
        first_entry: entries[0],
        num_entries: entries.length
      };
    }

    return stats;
  }

  static async Select_Last_Date(db, query_id)
  {
    var vals, date = 0;

    vals = await Trend.Select_By_Query_Id(db, query_id);
    if (!Utils.isEmpty(vals))
    {
      vals = Utils.Sort(vals, "datetime");
      date = vals[vals.length - 1].datetime;
    }

    return date;
  }

  /**
   * Return the last Trend entry that occured a month from now
   * @static
   * @param {Entry[]} entries - Array of Trend objects that has already been sorted by datetime
   * @returns {Entry}
   */
  static Get_Prev_Month_Entry(entries)
  {
    let res = null;

    const millis_per_month = 1000 * 60 * 60 * 24 * 30;
    const month_start = Date.now() - millis_per_month;

    if (!Utils.isEmpty(entries))
    {
      if (entries.length == 1)
        res = entries[0];
      else
      {
        let entry = null;
        for (let i = entries.length-1; i > 0; i--)
        {
          entry = entries[i-1];
          if (entry.datetime < month_start)
          {
            break;
          }
        }
        res = entry;
      }
    }

    return res;
  }

  static async Select_Chart_Vals_By_Query_Id(db, query_id)
  {
    let vals = null;
    const span_count = 100;

    const items = await Trend.Select_By_Query_Id(db, query_id);
    if (!Utils.isEmpty(items))
    {
      const groups = Utils.Group_By_Ceil_Span(items, "datetime", span_count);
      vals = await Trend.To_Chart_Vals(db, groups, [query_id]);
    }

    return vals;
  }

  static async Select_Chart_Vals_By_Query_Ids(db, query_ids)
  {
    let vals = null;
    const span_count = 100;

    const items = await Trend.Select_By_Query_Ids(db, query_ids);
    if (!Utils.isEmpty(items))
    {
      const groups = Utils.Group_By_Ceil_Span(items, "datetime", span_count);
      vals = await Trend.To_Chart_Vals(db, groups, query_ids);
    }

    return vals;
  }

  /**
   * Get a single Trend object based on the given ID
   * @static
   * @param {Db} db
   * @param {string} id
   * @returns {Trend}
   */
  static Select_By_Id(db, id)
  {
    return db.Select_Obj_By_Id(Trend.table, id);
  }

  static async To_Chart_Vals(db, groups, query_ids)
  {
    let vals = null;

    if (!Utils.isEmpty(groups) && !Utils.isEmpty(query_ids))
    {
      vals = [['Date']];
      for (const query_id of query_ids)
      {
        const query_title = await Trend.Get_Query_Title(db, query_id);
        vals[0].push(query_title);
      }

      for (const group of groups)
      {
        const val = [Math.trunc(Number(group.id))];
        for (const query_id of query_ids)
        {
          let item_avg = null;
          const items = group.items.filter(item => item.query_id == query_id);
          if (!Utils.isEmpty(items))
          {
            const item_count = items.length;
            const item_total = items.reduce((total, item) => total + item.count, 0);
            item_avg = item_total / item_count;
          }
          val.push(item_avg);
        }
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
      trend.is_interpolation = false;
      res = db.Insert(Trend.table, trend);
      res = true;
    }

    return res;
  }

  static async Insert_Interpolation(db, from_id, to_id, query_id, error)
  {
    let res = false;
    const from_entry = await Trend.Select_By_Id(db, from_id);
    const to_entry = await Trend.Select_By_Id(db, to_id);
    const new_entries = Trend.Interpolate(from_entry, to_entry, query_id, error);
    if (!Utils.isEmpty(new_entries))
    {
      const saves = new_entries.map(trend => Trend.Save(db, trend));
      const results = await Promise.all(saves);
      res = results.every(result => result != null);
    }

    return res;
  }

  static Save(db, trend)
  {
    return db.Save(Trend.table, trend);
  }

  static Delete(db, id)
  {
    return db.Delete(id);
  }

  static Delete_By_Ids(db, ids)
  {
    return db.Delete_By_Ids(Trend.table, ids);
  }

  /**
   * Creates a set of trend objects that interpolate random values between the counts of
   * two given trend objects. A Trend object is created for every month within the time span
   * of the two given Trend objects and the count is given a random value based on a linear
   * interpolation of the two Trend objects and with a variance of +/- the error value.
   * @static
   * @param {Trend} from_entry
   * @param {Trend} to_entry 
   * @param {string} query_id - Query ID to set for all resulting trend objects
   * @param {number} error - Indicates the +/- variance of the random count values
   * @returns {Trend[]}
   */
  static Interpolate(from_entry, to_entry, query_id, error)
  {
    let trends = null;

    if (from_entry.datetime > to_entry.datetime)
    {
      const temp = to_entry;
      to_entry = from_entry;
      from_entry = temp;
    }

    const months = Trend.Months_In_Range(from_entry.datetime, to_entry.datetime);
    if (!Utils.isEmpty(months))
    {
      const diff_count = to_entry.count - from_entry.count;
      const month_change = diff_count / months.length;
      let month_count = from_entry.count;
      trends = [];

      for (const month of months)
      {
        month_count += month_change;
        const count = Math.trunc(Utils.Random_Error(month_count, error));
        const trend = 
        {
          query_id,
          datetime: month,
          count: count,
          is_interpolation: true,
        };
        trends.push(trend);
      }
    }

    return trends;
  }

  static Months_In_Range(from_time, to_time)
  {
    let dates = null;

    if (to_time > from_time)
    {
      dates = [];

      let from_date = new Date(from_time);
      from_date.setMonth(from_date.getMonth() + 1);
      const to_date = new Date(to_time);

      for (let date = from_date; date < to_date; date.setMonth(date.getMonth() + 1))
      {
        const time = date.getTime();
        dates.push(time);
      }
    }

    return dates;
  }
  
  // legacy =============================================================================

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
}

export default Trend;