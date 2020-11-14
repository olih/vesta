import { handler } from '../src/lib/main';

const event = {
  source: 'aws.events',
  time: '2015-10-08T16:53:06Z',
};

test('Send a daily update', async () => {
  const result = await handler(event);
  expect(result.statusCode).toEqual(200);
  expect(result.body).toEqual('Daily update 2015-10-08T16:53:06Z');
});
