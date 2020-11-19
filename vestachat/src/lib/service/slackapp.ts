import { WebClient, LogLevel } from '@slack/web-api';
import { envConfig } from '../envconfig';

const web = new WebClient(envConfig.slackBotToken, {
  logLevel: LogLevel.DEBUG,
});

const slackPostMessage = async (
  channel: string,
  text: string,
  blocks: any[]
) => {
  const result = await web.chat.postMessage({
    channel,
    text,
    blocks,
  });
  return result;
};

export { slackPostMessage };
