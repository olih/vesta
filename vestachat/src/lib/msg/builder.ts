import { DailyMessage } from './daily';
import {
  createCheckboxes,
  createMarkdownSection,
  createPlainHeader,
} from './slackmsg';

const fromDailyMessage = (msg: DailyMessage) => {
  const blocks = [
    createPlainHeader(msg.title),
    createMarkdownSection(msg.lunch),
    createMarkdownSection(msg.supper),
  ];
  if (msg.events) {
    blocks.push(createCheckboxes('Events', msg.events));
  }
  if (msg.casual_tasks) {
    blocks.push(createCheckboxes('Casual tasks', msg.casual_tasks));
  }
  if (msg.occasional_tasks) {
    blocks.push(createCheckboxes('Occasional tasks', msg.occasional_tasks));
  }
  if (msg.shopping) {
    blocks.push(createCheckboxes('Shopping', msg.shopping));
  }
  return blocks;
};

export { fromDailyMessage };
