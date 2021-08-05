// Copyright 2021 Touca, Inc. Subject to Apache-2.0 License.

import { BaseOptions } from './types';

/**
 *
 */
export class Transport {
  private _token = '';

  constructor(private readonly options: BaseOptions) {}

  public async get_testcases(): Promise<string[]> {
    return Promise.resolve([]);
  }

  public async post(content: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  public async seal(): Promise<boolean> {
    return Promise.resolve(false);
  }

  public has_token(): boolean {
    return this._token.length !== 0;
  }
}
