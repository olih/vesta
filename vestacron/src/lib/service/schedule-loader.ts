import AWS from 'aws-sdk';
import { envConfig } from '../envconfig';

import { Schedule } from '../model/schedule';

type ScheduleLoader = (date: string) => Promise<Schedule>;

const s3 = new AWS.S3();

const loadSchedule: ScheduleLoader = async (
  date: string
) => {
  const params = {
    Bucket: envConfig.bucketName,
    Key: `vestacron/alert_${date.substring(0, 10)}.json`
  };
  const resp = await s3.getObject(params).promise()
  const content = resp.Body === undefined ? "{}" : resp.Body.toString();
  const schedule: Schedule = JSON.parse(content);
  return schedule;
};

export { loadSchedule };
