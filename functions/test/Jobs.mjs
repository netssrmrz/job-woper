import assert from 'assert';
import fs from "fs";
import Jobs from "../tb/Jobs.js";
import zenrows_mock from "./data/zenrows_mock.mjs";

describe('class Jobs', Test_Indeed);

function Test_Indeed() 
{
  it('Extract_Count', Extract_Count);
  it('Get_Job_Count', Get_Job_Count);
  it('Get_Job_Page', Get_Job_Page);
}

async function Get_Job_Page()
{
  const res_html = fs.readFileSync("./functions/test/data/indeed3.html").toString();

  const actual = await Jobs.Get_Job_Page(zenrows_mock, "page");
  assert.ok(actual);
  assert.equal(actual.count, 3);
  assert.equal(actual.html, res_html);
  assert.ok(actual.indeed_url.includes("q=page"));
}

async function Extract_Count() 
{
  let msg, expected, res_html, actual;

  msg = 'should return a non-zero value when able to extract the job count';
  expected = 3;
  res_html = fs.readFileSync("./functions/test/data/indeed3.html").toString();
  actual = await Jobs.Extract_Count(res_html);
  assert.equal(actual, expected, msg);

  msg = 'should return a non-zero value when able to extract the job count';
  expected = 4;
  res_html = fs.readFileSync("./functions/test/data/indeed4.html").toString();
  actual = await Jobs.Extract_Count(res_html);
  assert.equal(actual, expected, msg);
}

async function Get_Job_Count()
{
  let msg = 'should extract the job count via an HTTP fetch';
  let query_str = "c%23";
  let actual = await Jobs.Get_Job_Count(zenrows_mock, query_str);
  assert.equal(actual, 10, msg);

  query_str = "null";
  actual = await Jobs.Get_Job_Count(zenrows_mock, query_str);
  assert.equal(actual, 0, msg);

  query_str = "error";
  actual = await Jobs.Get_Job_Count(zenrows_mock, query_str);
  assert.equal(actual, null, msg);
}
