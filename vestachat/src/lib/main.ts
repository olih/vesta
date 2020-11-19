import { ErrorCode } from '@slack/web-api';
import { envConfig } from './envconfig';
import { Schedule } from './model/schedule';
import { fromDailyMessage } from './msg/builder';
import { fromSchedule } from './msg/daily';
import { slackPostMessage } from './service/slackapp';

interface ServiceResponse {
  readonly body: string;
  readonly isBase64Encoded: boolean;
  readonly statusCode: number;
}

type ServiceHandler = (event: any) => Promise<ServiceResponse>;

interface ServiceEvent {
  readonly time: string;
  readonly detail: Schedule;
}

const asBlocks = (schedule: Schedule) => {
  if (!envConfig.appMode.includes('load')) {
    return [];
  }
  const daily = fromSchedule(schedule);
  const blocks = fromDailyMessage(daily);
  return blocks;
};

const slackMessage = async (timedata: string, blocks: any[]) => {
  if (!envConfig.appMode.includes('slack')) {
    return Promise.resolve();
  }
  try {
    await slackPostMessage('#general', `Daily update ${timedata}`, blocks);
  } catch (error) {
    if (error.code === ErrorCode.PlatformError) {
      console.log(error.data);
    } else {
      console.log('Well, that was unexpected.');
    }
  }
};

const createResponse = (body: string) => ({
  body,
  isBase64Encoded: false,
  statusCode: 200,
});

const handler: ServiceHandler = async (event: ServiceEvent) => {
  console.log('event date_human', event.detail.date_human);
  const blocks = asBlocks(event.detail);
  console.log('blocks', blocks);
  await slackMessage(event.time, blocks);
  return createResponse(`Daily update ${event.time}`);
};

export { handler };
