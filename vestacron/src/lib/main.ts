import { loadSchedule } from './service/schedule-loader';
import { publishSchedule } from './service/schedule-publisher';

interface ServiceResponse {
  readonly body: string;
  readonly isBase64Encoded: boolean;
  readonly statusCode: number;
}


type ServiceHandler = (event: any) => Promise<ServiceResponse>;

interface ServiceEvent {
  readonly source: string;
  readonly time: string;
}

const createResponse = (body: string) => ({
  body,
  isBase64Encoded: false,
  statusCode: 200,
})


const handler: ServiceHandler = async (event: ServiceEvent) => {
  try {
    const schedule = await loadSchedule(event.time)
    await publishSchedule(schedule)
    return createResponse(`Schedule Daily update ${event.time} on ${schedule.date_human}`)
  } catch (error) {
    console.error(error)
    return createResponse(`Failed schedule daily update ${event.time}`)
  }
};

export { handler };
