import { loadSchedule } from '../src/lib/service/schedule-loader';

test('load daily alert', async () => {
  const schedule = await loadSchedule('test', '2020-11-01');
  expect(schedule.date).toEqual('2020-11-01');
  expect(schedule.date_human).toEqual('Sunday, 01 November');
  expect(schedule.events[0].id).toEqual('christmas');
  expect(schedule.casual_tasks[0].id).toEqual('brush-teeth');
  expect(schedule.occasional_tasks[0].description).toEqual('Clean windows');
  expect(schedule.shopping[0].description).toEqual('Bread');
  expect(schedule.lunch.link).toEqual('https://website.com/ratatouille');
  expect(schedule.supper.link).toEqual('https://website.com/pasta');
});
