import { WebClient, LogLevel } from '@slack/web-api';

const web = new WebClient(process.env.SLACK_BOT_TOKEN, {
  logLevel: LogLevel.DEBUG,
});

const slackPostMessage = async (channel: string, text: string, blocks: any[]) => {
  const result = await web.chat.postMessage({
    channel,
    text,
    blocks,
  });
  return result;
};

export { slackPostMessage };
