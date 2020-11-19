interface EnvConfig {
    bucketName: string;
    eventBusName: string;
}

const envConfig: EnvConfig = {
    bucketName: process.env.BUCKET_NAME || 'some-bucket-name',
    eventBusName: process.env.EVT_BUS_NAME || 'evt-bus-name'
}

export {envConfig}