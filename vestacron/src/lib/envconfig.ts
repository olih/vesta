interface EnvConfig {
    readDataDir: string;
    topicArn: string;
}

const envConfig: EnvConfig = {
    readDataDir: process.env.READ_DATA_DIR || '/data/read',
    topicArn: process.env.TOPIC_ARN || 'arn:aws:sns:define-me'
}

export {envConfig}