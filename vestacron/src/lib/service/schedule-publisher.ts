import AWS from 'aws-sdk'
import { envConfig } from '../envconfig';
import { Schedule } from '../model/schedule'

const publishSchedule = async (schedule: Schedule) => {
    const evtBridge = new AWS.EventBridge();
    var params = {
        Entries: [
            {
                Source: 'custom.olih.vestacron',
                Detail: JSON.stringify(schedule),
                DetailType: "vesta schedule event",
                EventBusName: "vesta-event-bus",
                Time: new Date()
            }
        ]
    };
    const resp = await evtBridge.putEvents(params).promise();
    console.log('publishSchedule', resp)
    return resp
}

const publishToTopic = async (schedule: Schedule) => {
    const sns = new AWS.SNS()
    const params = {
        Message: JSON.stringify(schedule),
        TopicArn: envConfig.topicArn
      };
      const resp = await sns.publish(params).promise();
      console.log('publishToTopic', resp)
      return resp
}

export { publishSchedule , publishToTopic}