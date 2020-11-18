// import { loadLocalSchedule } from './service/schedule-loader';
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

const exSchedule = {
  "date": "2020-11-01",
  "date_human": "Sunday, 01 November",
  "weekday": 7,
  "events": [
    {
      "id": "christmas",
      "description": "Christmas",
      "flags": "event"
    }
  ],
  "casual_tasks": [
    {
      "id": "brush-teeth",
      "description": "Brush teeth",
      "flags": "Daily"
    }
  ],
  "occasional_tasks": [
    {
      "id": "clean-windows",
      "description": "Clean windows",
      "flags": "Quaterly"
    }
  ],
  "shopping": [
    {
      "id": "bread",
      "description": "Bread",
      "flags": "Weekly"
    },
    {
      "id": "butter",
      "description": "Butter",
      "flags": "Weekly"
    }
  ],
  "lunch": {
    "id": "ratatouille",
    "description": "Ratatouille",
    "link": "https://website.com/ratatouille",
    "flags": "fresh"
  },
  "supper": {
    "id": "pasta",
    "description": "Pasta",
    "link": "https://website.com/pasta",
    "flags": "fresh x2"
  }
}

const handler: ServiceHandler = async (event: ServiceEvent) => {
  try {
    //const schedule = await loadLocalSchedule(event.time)
    const schedule = exSchedule
    await publishSchedule(schedule)
    return createResponse(`Schedule Daily update ${event.time} on ${schedule.date_human}`)
  } catch (error) {
    console.error(error)
    return createResponse(`Failed schedule daily update ${event.time}`)
  }
};

export { handler };
