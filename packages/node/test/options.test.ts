// Copyright 2021 Touca, Inc. Subject to Apache-2.0 License.

// import { NodeClient } from '../src/client';
import { NodeOptions, update_options } from '../src/options';

test('empty', async () => {
  const existing: NodeOptions = {};
  update_options(existing, {});
  expect(existing).toEqual({ concurrency: true });
});

test('invalid filepath', async () => {
  const incoming = { file: 'some/path' };
  expect(() => {
    update_options({}, incoming);
  }).toThrowError('file not found');
});
