import { loadLocalSchedule } from './service/schedule-loader';

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

const handler: ServiceHandler = async (event: ServiceEvent) => {
  const response: ServiceResponse = {
    body: `Schedule Daily update ${event.time}`,
    isBase64Encoded: false,
    statusCode: 200,
  };
  const schedule = await loadLocalSchedule(event.time)
  return response;
};

export { handler };
