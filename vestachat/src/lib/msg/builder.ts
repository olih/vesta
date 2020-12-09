import { DailyMessage } from './daily';
import {
  createCheckboxes,
  createMarkdownSection,
  createPlainHeader,
} from './slackmsg';

const chunk = (items: any[], size: number) => {
  const chunked_arr = [];
  let copied = [...items];
  const numOfChild = Math.ceil(copied.length / size);
  for (let i = 0; i < numOfChild; i++) {
    chunked_arr.push(copied.splice(0, size));
  }
  return chunked_arr;
};

const fromDailyMessage = (msg: DailyMessage) => {
  const blocks = [
    createPlainHeader(msg.title),
    createMarkdownSection(msg.lunch),
    createMarkdownSection(msg.supper),
  ];
  if (msg.info.length > 0) {
    blocks.push(createMarkdownSection(msg.info))
  }
  if (msg.events.length > 0) {
    chunk(msg.events, 10).forEach(group =>
      blocks.push(createCheckboxes('Events', group))
    );
  }
  if (msg.casual_tasks.length > 0) {
    chunk(msg.casual_tasks, 10).forEach(group =>
      blocks.push(createCheckboxes('Casual tasks', group))
    );
  }
  if (msg.occasional_tasks.length > 0) {
    chunk(msg.occasional_tasks, 10).forEach(group =>
      blocks.push(createCheckboxes('Occasional tasks', group))
    );
  }
  if (msg.shopping.length > 0) {
    chunk(msg.shopping, 10).forEach(group =>
      blocks.push(createCheckboxes('Shopping', group))
    );
  }
  return blocks;
};

export { fromDailyMessage };
