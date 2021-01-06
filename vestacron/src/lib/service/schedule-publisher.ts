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
                EventBusName: envConfig.eventBusName,
                Time: new Date()
            }
        ]
    };
    const resp = await evtBridge.putEvents(params).promise();
    console.log('publishSchedule', resp)
    return resp
}

export { publishSchedule }