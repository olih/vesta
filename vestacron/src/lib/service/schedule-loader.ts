import { Schedule } from '../model/schedule';
const fs = require('fs').promises;

type ScheduleLoader = (readDataDir: string, date: string) => Promise<Schedule>;

const loadSchedule: ScheduleLoader = async (
  readDataDir: string,
  date: string
) => {
  const content = await fs.readFile(`${readDataDir}/alert_${date.substring(0, 10)}.json`);
  const schedule: Schedule = JSON.parse(content);
  return schedule;
};

const envReadDataDir: string = process.env.READ_DATA_DIR || 'data'

const loadLocalSchedule = async (date: string) => loadSchedule(envReadDataDir, date)

export { loadSchedule, loadLocalSchedule };
