import * as functions from 'firebase-functions/v2';
import api_app from "./api.mjs"

const api_options =
{
  region: ["australia-southeast1"],
  minInstances: 0,
  concurrency: 80
};
export const api = 
  functions
    .https
    .onRequest(api_options, api_app);

const schedule_options = {timeoutSeconds: 540};
export const updateAllTrendsScheduled = 
  functions
    .runWith(schedule_options)
    .pubsub
    .schedule('every day 11:30')
    .timeZone("Australia/Sydney")
    .onRun(Update_All_Trends);
