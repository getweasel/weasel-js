// Copyright 2021 Touca, Inc. Subject to Apache-2.0 License.

import { NodeClient } from '../src/client';

test('basic api', async () => {
  const client = new NodeClient();
  client.init({});
  client.add_result('some-key', 'some-value');
  expect(await client.post()).toBe(false);
});
