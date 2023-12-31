import assert from "assert";
import Utils from "../tb/Utils.js"

describe('class Utils', Utils_Tests);

function Utils_Tests() 
{
  //this.timeout(5000);

  it('Maximum', Maximum);
  it('Minimum', Minimum);
  it('Ceiling_Bounded', Ceiling_Bounded);
  it('Group_By_Ceil_Span', Group_By_Ceil_Span);
  it('Random_Error', Random_Error);
}

function Maximum() 
{
  const items =
  [
    {datetime: 12345},
    {datetime: 54321},
    {datetime: 23451},
  ];
  const actual = Utils.Maximum(items, "datetime");
  const expected = 54321;
  const msg = actual + ' should match ' + expected;
  assert.equal(actual.datetime, expected, msg);
}

function Minimum() 
{
  const items =
  [
    {datetime: 12345},
    {datetime: 54321},
    {datetime: 23451},
  ];
  const actual = Utils.Minimum(items, "datetime");
  const expected = 12345;
  const msg = actual + ' should match ' + expected;
  assert.equal(actual.datetime, expected, msg);
}

function Ceiling_Bounded()
{
  const max = 513, min = 123, span_count = 5;

  let actual = Utils.Ceiling_Bounded(min, max, min, span_count);
  let expected = min;
  assert.equal(actual, expected);

  actual = Utils.Ceiling_Bounded(max, max, min, span_count);
  expected = max;
  assert.equal(actual, expected);

  actual = Utils.Ceiling_Bounded(124, max, min, span_count);
  expected = 201;
  assert.equal(actual, expected);

  actual = Utils.Ceiling_Bounded(201, max, min, span_count);
  expected = 201;
  assert.equal(actual, expected);

  actual = Utils.Ceiling_Bounded(202, max, min, span_count);
  expected = 279;
  assert.equal(actual, expected);
}

function Group_By_Ceil_Span()
{
  // span ids: 123, 201, 279, 357, 435, 513
  const span_count = 5;
  const field_name = "datetime";
  const items =
  [
    {datetime: 444},
    {datetime: 123},
    {datetime: 513},
    {datetime: 123},
    {datetime: 513},
    {datetime: 222},
    {datetime: 333},
    {datetime: 511},
    {datetime: 234},
    {datetime: 456},
  ];

  const actual = Utils.Group_By_Ceil_Span(items, field_name, span_count);
  assert.equal(actual.find(g=>g.id==123).items.length, 2);
  assert.equal(actual.find(g=>g.id==201), undefined);
  assert.equal(actual.find(g=>g.id==279).items.length, 2);
  assert.equal(actual.find(g=>g.id==357).items.length, 1);
  assert.equal(actual.find(g=>g.id==435), undefined);
  assert.equal(actual.find(g=>g.id==513).items.length, 5);
}

function Random_Error()
{
  let from = 100, error = 50;
  let actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);

  from = 50, error = 25;
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);

  from = 20, error = 10;
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);

  from = 0, error = 5;
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);

  from = -10, error = 1;
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
  actual = Utils.Random_Error(from, error);
  assert.ok(actual >= from-error && actual < from+error);
}