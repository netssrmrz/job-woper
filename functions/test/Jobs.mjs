import assert from 'assert';
import fs from "fs";
import Jobs from "../tb/Jobs.js";

describe('class Jobs', Test_Indeed);

function Test_Indeed() 
{
  it('Extract_Count', Extract_Count);
  it('Get_Job_Count', Get_Job_Count);
}

async function Extract_Count() 
{
  this.timeout(5000);
  let msg, expected, res_html, actual;

  msg = 'should return a non-zero value when able to extract the job count';
  expected = 3;
  res_html = fs.readFileSync("./test/data/indeed3.html").toString();
  actual = await Jobs.Extract_Count(res_html);
  assert.equal(actual, expected, msg);

  msg = 'should return a non-zero value when able to extract the job count';
  expected = 4;
  res_html = fs.readFileSync("./test/data/indeed4.html").toString();
  actual = await Jobs.Extract_Count(res_html);
  assert.equal(actual, expected, msg);
}

async function Get_Job_Count()
{
  this.timeout(10000);

  let msg = 'should extract the job count via an HTTP fetch';
  let query_str = "c%23";
  let actual = await Jobs.Get_Job_Count(query_str);
  assert.equal(actual > 0, true, msg);
  console.log("count =", actual);
}