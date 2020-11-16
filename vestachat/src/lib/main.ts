import { ErrorCode } from '@slack/web-api';
import { fromDailyMessage } from './msg/builder';
import { fromSchedule } from './msg/daily';
import { callweb } from './service/callweb';
import { loadLocalSchedule } from './service/schedule-loader';
import { slackPostMessage } from './service/slackapp';

interface ServiceResponse {
  readonly body: string;
  readonly isBase64Encoded: boolean;
  readonly statusCode: number;
}

const appMode: string = process.env.APP_MODE || ""

type ServiceHandler = (event: any) => Promise<ServiceResponse>;

interface ServiceEvent {
  readonly source: string;
  readonly time: string;
}

const checkWeb = async () => {
  if (!appMode.includes("check")) {
    return Promise.resolve()
  }
 await callweb()
}

const loadBlocks = async (timedata: string) => {
  if (!appMode.includes("load")) {
    return Promise.resolve([])
  }
  const schedule = await loadLocalSchedule(timedata)
  const daily = fromSchedule(schedule)
  const blocks = fromDailyMessage(daily)
  console.log('blocks',blocks)
  return blocks
}

const slackMessage = async (timedata: string, blocks: any[]) => {
  if (!appMode.includes("slack")) {
    return Promise.resolve()
  }
  try {
    await slackPostMessage("#general", `Daily update ${timedata}`, blocks)
  } catch (error) {
    if (error.code === ErrorCode.PlatformError) {
      console.log(error.data);
    } else {
      console.log('Well, that was unexpected.');
    }
  }

}
const handler: ServiceHandler = async (event: ServiceEvent) => {
  const response: ServiceResponse = {
    body: `Daily update ${event.time}`,
    isBase64Encoded: false,
    statusCode: 200,
  };
  const blocks = await loadBlocks(event.time)
  await checkWeb()
  await slackMessage(event.time, blocks)
  return response;
};

export { handler };
