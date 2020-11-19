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
  if (msg.events.length > 0) {
    blocks.push(createCheckboxes('Events', msg.events));
  }
  if (msg.casual_tasks.length > 0) {
    blocks.push(createCheckboxes('Casual tasks', msg.casual_tasks));
  }
  if (msg.occasional_tasks.length > 0) {
    blocks.push(createCheckboxes('Occasional tasks', msg.occasional_tasks));
  }
  if (msg.shopping.length > 0) {
    blocks.push(createCheckboxes('Shopping', msg.shopping));
  }
  return blocks;
};

export { fromDailyMessage };
