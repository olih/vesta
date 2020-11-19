import { Schedule } from '../src/lib/model/schedule';
import { DailyMessage, fromSchedule } from '../src/lib/msg/daily';
import { fromDailyMessage } from '../src/lib/msg/builder';

const createTask = (id: number, flags: string) => ({
  id: `id-${id}`,
  description: `description ${id}`,
  flags,
});

const createRecipe = (id: number, flags: string) => ({
  id: `id-${id}`,
  description: `Recipe ${id}`,
  link: `http://website.com/${id}`,
  flags,
});

test('Convert from schedule', () => {
  const schedule: Schedule = {
    date: '2011-11-10',
    date_human: 'Nov 10',
    casual_tasks: [createTask(1, 'Daily')],
    occasional_tasks: [createTask(2, '')],
    shopping: [createTask(3, 'Green Vegetable')],
    events: [createTask(4, '')],
    lunch: createRecipe(10, ''),
    supper: createRecipe(11, ''),
  };
  const expectedMsg: DailyMessage = {
    title: 'Today Nov 10',
    lunch: '*Lunch*: Recipe 10\n<http://website.com/10|lunch recipe>',
    supper: '*Supper*: Recipe 11\n<http://website.com/11|supper recipe>',
    casual_tasks: [
      {
        title: 'description 1 _Daily_',
        value: 'id-1',
      },
    ],
    occasional_tasks: [
      {
        title: 'description 2',
        value: 'id-2',
      },
    ],
    shopping: [
      {
        title: 'description 3 _Green_ _Vegetable_',
        value: 'id-3',
      },
    ],
    events: [
      {
        title: 'description 4',
        value: 'id-4',
      },
    ],
  };

  const expectedBlocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Today Nov 10',
        emoji: false,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Lunch*: Recipe 10\n<http://website.com/10|lunch recipe>',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Supper*: Recipe 11\n<http://website.com/11|supper recipe>',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Events',
      },
      accessory: {
        type: 'checkboxes',
        options: [
          {
            text: {
              type: 'mrkdwn',
              text: 'description 4',
            },
            value: 'id-4',
          },
        ],
        action_id: 'checkboxes-action',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Casual tasks',
      },
      accessory: {
        type: 'checkboxes',
        options: [
          {
            text: {
              type: 'mrkdwn',
              text: 'description 1 _Daily_',
            },
            value: 'id-1',
          },
        ],
        action_id: 'checkboxes-action',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Occasional tasks',
      },
      accessory: {
        type: 'checkboxes',
        options: [
          {
            text: {
              type: 'mrkdwn',
              text: 'description 2',
            },
            value: 'id-2',
          },
        ],
        action_id: 'checkboxes-action',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Shopping',
      },
      accessory: {
        type: 'checkboxes',
        options: [
          {
            text: {
              type: 'mrkdwn',
              text: 'description 3 _Green_ _Vegetable_',
            },
            value: 'id-3',
          },
        ],
        action_id: 'checkboxes-action',
      },
    },
  ];
  const dailyMsg = fromSchedule(schedule);
  const blocks = fromDailyMessage(dailyMsg);
  expect(dailyMsg).toEqual(expectedMsg);
  expect(blocks).toEqual(expectedBlocks);
});

test('Convert from schedule with empty parts', () => {
  const schedule: Schedule = {
    date: '2011-11-10',
    date_human: 'Nov 10',
    casual_tasks: [createTask(1, 'Daily')],
    occasional_tasks: [],
    shopping: [],
    events: [createTask(4, '')],
    lunch: createRecipe(10, ''),
    supper: createRecipe(11, ''),
  };
  const expectedMsg: DailyMessage = {
    title: 'Today Nov 10',
    lunch: '*Lunch*: Recipe 10\n<http://website.com/10|lunch recipe>',
    supper: '*Supper*: Recipe 11\n<http://website.com/11|supper recipe>',
    casual_tasks: [
      {
        title: 'description 1 _Daily_',
        value: 'id-1',
      },
    ],
    occasional_tasks: [],
    shopping: [],
    events: [
      {
        title: 'description 4',
        value: 'id-4',
      },
    ],
  };

  const expectedBlocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Today Nov 10',
        emoji: false,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Lunch*: Recipe 10\n<http://website.com/10|lunch recipe>',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Supper*: Recipe 11\n<http://website.com/11|supper recipe>',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Events',
      },
      accessory: {
        type: 'checkboxes',
        options: [
          {
            text: {
              type: 'mrkdwn',
              text: 'description 4',
            },
            value: 'id-4',
          },
        ],
        action_id: 'checkboxes-action',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Casual tasks',
      },
      accessory: {
        type: 'checkboxes',
        options: [
          {
            text: {
              type: 'mrkdwn',
              text: 'description 1 _Daily_',
            },
            value: 'id-1',
          },
        ],
        action_id: 'checkboxes-action',
      },
    },
  ];
  const dailyMsg = fromSchedule(schedule);
  const blocks = fromDailyMessage(dailyMsg);
  expect(dailyMsg).toEqual(expectedMsg);
  expect(blocks).toEqual(expectedBlocks);
});
