import AWS from 'aws-sdk'
import YAML from 'yaml'
import { envConfig } from '../envconfig'
import { Schedule } from '../model/schedule'

const publishSchedule = async (schedule: Schedule) => {
    const strSchedule = YAML.stringify(schedule)
    const sns = new AWS.SNS();
    var params = {
        Message: strSchedule, 
        Subject: `Schedule ${schedule.date_human}`,
        TopicArn: envConfig.topicArn
    };
    await sns.publish(params);
}

export { publishSchedule }