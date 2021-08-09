// Copyright 2021 Touca, Inc. Subject to Apache-2.0 License.

import { NodeClient } from '../src/client';

class DateOfBirth {
  constructor(
    public readonly year: number,
    public readonly month: number,
    public readonly day: number
  ) {}
}

async function make_client(): Promise<NodeClient> {
  const delay = (ms: number) => new Promise((v) => setTimeout(v, ms));
  const courses = ['math', 'english'];
  const client = new NodeClient();
  client.configure({
    team: 'some-team',
    suite: 'some-suite',
    version: 'some-version'
  });
  client.declare_testcase('some-case');
  client.add_assertion('username', 'potter');
  client.add_result('is_famous', true);
  client.add_result('tall', 6.1);
  client.add_result('age', 21);
  client.add_result('name', 'harry');
  client.add_result('dob', new DateOfBirth(2000, 1, 1));
  client.add_result('courses', courses);
  for (const course of courses) {
    client.add_array_element('course-names', course);
    client.add_hit_count('course-count');
  }
  client.add_metric('exam_time', 42);
  client.start_timer('small_time');
  await delay(10);
  client.stop_timer('small_time');
  await client.scoped_timer('scoped_timer', () => {
    delay(10);
  });
  return client;
}

test('check basic configure', () => {
  const client = new NodeClient();
  expect(client.configuration_error()).toEqual('');
  expect(client.is_configured()).toEqual(false);
  expect(() => {
    client.configure({
      concurrency: true,
      api_url: 'https://api.touca.io/@/team/suite/v1',
      api_key: 'some-key',
      offline: true
    });
  }).not.toThrow();
  expect(client.is_configured()).toEqual(true);
});

test('check missing options', () => {
  const client = new NodeClient();
  expect(client.configuration_error()).toEqual('');
  expect(client.is_configured()).toEqual(false);
  expect(() => {
    client.configure({
      concurrency: true,
      api_url: 'https://api.touca.io/@/team/suite',
      api_key: 'some-key',
      offline: true
    });
  }).not.toThrow();
  expect(client.configuration_error()).toEqual(
    'Configuration failed: missing required option(s) "version"'
  );
  expect(client.is_configured()).toEqual(false);
});

test('check loaded client', async () => {
  const client = await make_client();
  expect(client.is_configured()).toEqual(true);
  await client.save_json('some_path', []);
});
