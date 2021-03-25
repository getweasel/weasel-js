/**
 * Copyright 2018-2020 Pejman Ghorbanzade. All rights reserved.
 */

import { Client } from '../src'

test('configure client', () => {
  const client = new Client({
    apiUrl: 'some-api-url'
  })
  expect(client.add_result('some-key', 'some-value'))
})
