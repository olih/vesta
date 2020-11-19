interface EnvConfig {
  appMode: string;
  slackBotToken: string;
  slackSigningSecret: string;
}

const envConfig: EnvConfig = {
  appMode: process.env.APP_MODE || 'load slack',
  slackBotToken: process.env.SLACK_BOT_TOKEN || 'xoxb-slack',
  slackSigningSecret: process.env.SLACK_SIGNING_SECRET || 'slack-signing',
};

export { envConfig };
