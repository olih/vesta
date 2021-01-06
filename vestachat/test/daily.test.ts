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
    info: ["Meal A this week"]
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
    info: "*Info*: Meal A this week"
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
        text: '*Info*: Meal A this week',
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
    info: []
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
    info: ""
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

test('Convert from schedule with  more than 10 items', () => {
  const createDailyTask = (id: number) => createTask(id, 'Daily');
  const schedule: Schedule = {
    date: '2011-11-10',
    date_human: 'Nov 10',
    casual_tasks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(createDailyTask),
    occasional_tasks: [],
    shopping: [],
    events: [],
    lunch: createRecipe(10, ''),
    supper: createRecipe(11, ''),
    info: []
  };
  const expectedMsg: DailyMessage = {
    title: 'Today Nov 10',
    lunch: '*Lunch*: Recipe 10\n<http://website.com/10|lunch recipe>',
    supper: '*Supper*: Recipe 11\n<http://website.com/11|supper recipe>',
    info: "",
    casual_tasks: [
      {
        title: 'description 1 _Daily_',
        value: 'id-1',
      },
      {
        title: 'description 2 _Daily_',
        value: 'id-2',
      },
      {
        title: 'description 3 _Daily_',
        value: 'id-3',
      },
      {
        title: 'description 4 _Daily_',
        value: 'id-4',
      },
      {
        title: 'description 5 _Daily_',
        value: 'id-5',
      },
      {
        title: 'description 6 _Daily_',
        value: 'id-6',
      },
      {
        title: 'description 7 _Daily_',
        value: 'id-7',
      },
      {
        title: 'description 8 _Daily_',
        value: 'id-8',
      },
      {
        title: 'description 9 _Daily_',
        value: 'id-9',
      },
      {
        title: 'description 10 _Daily_',
        value: 'id-10',
      },
      {
        title: 'description 11 _Daily_',
        value: 'id-11',
      },
      {
        title: 'description 12 _Daily_',
        value: 'id-12',
      },
    ],
    occasional_tasks: [],
    shopping: [],
    events: [],
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
          {
            text: {
              type: 'mrkdwn',
              text: 'description 2 _Daily_',
            },
            value: 'id-2',
          },
          {
            text: {
              type: 'mrkdwn',
              text: 'description 3 _Daily_',
            },
            value: 'id-3',
          },
          {
            text: {
              type: 'mrkdwn',
              text: 'description 4 _Daily_',
            },
            value: 'id-4',
          },
          {
            text: {
              type: 'mrkdwn',
              text: 'description 5 _Daily_',
            },
            value: 'id-5',
          },
          {
            text: {
              type: 'mrkdwn',
              text: 'description 6 _Daily_',
            },
            value: 'id-6',
          },
          {
            text: {
              type: 'mrkdwn',
              text: 'description 7 _Daily_',
            },
            value: 'id-7',
          },
          {
            text: {
              type: 'mrkdwn',
              text: 'description 8 _Daily_',
            },
            value: 'id-8',
          },
          {
            text: {
              type: 'mrkdwn',
              text: 'description 9 _Daily_',
            },
            value: 'id-9',
          },
          {
            text: {
              type: 'mrkdwn',
              text: 'description 10 _Daily_',
            },
            value: 'id-10',
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
              text: 'description 11 _Daily_',
            },
            value: 'id-11',
          },
          {
            text: {
              type: 'mrkdwn',
              text: 'description 12 _Daily_',
            },
            value: 'id-12',
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
