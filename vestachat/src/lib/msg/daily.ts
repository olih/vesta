import { Schedule } from '../model/schedule';
import { Task } from '../model/task';
import { SlackOption } from './slackmsg';

interface DailyMessage {
  readonly title: string;
  readonly lunch: string;
  readonly supper: string;
  readonly info: string;
  readonly casual_tasks: SlackOption[];
  readonly occasional_tasks: SlackOption[];
  readonly shopping: SlackOption[];
  readonly events: SlackOption[];
}

const displayFlags = (flags: string) => {
  return flags
    .split(' ')
    .map(s => `_${s}_`)
    .join(' ');
};

const toTaskOption = (task: Task) => ({
  title:
    task.flags.length === 0
      ? task.description
      : `${task.description} ${displayFlags(task.flags)}`,
  value: task.id,
});

type ScheduleToDailyMessage = (schedule: Schedule) => DailyMessage;
const fromSchedule: ScheduleToDailyMessage = (schedule: Schedule) => ({
  title: `Today ${schedule.date_human}`,
  lunch: `*Lunch*: ${schedule.lunch.description}\n<${schedule.lunch.link}|lunch recipe>`,
  supper: `*Supper*: ${schedule.supper.description}\n<${schedule.supper.link}|supper recipe>`,
  info: schedule.info.length>0 ? `*Info*: ${schedule.info.join('\n')}`: '',
  casual_tasks: schedule.casual_tasks.map(toTaskOption),
  occasional_tasks: schedule.occasional_tasks.map(toTaskOption),
  shopping: schedule.shopping.map(toTaskOption),
  events: schedule.events.map(toTaskOption),
});

export { DailyMessage, fromSchedule };
