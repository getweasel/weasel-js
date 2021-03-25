/**
 * Copyright 2018-2020 Pejman Ghorbanzade. All rights reserved.
 */

/**
 *
 */
export type ClientOptions = {
  apiKey?: string
  apiUrl: string
  version?: string
  suite?: string
  team?: string
  handshake?: boolean
}

/**
 *
 */
export class Client {
  constructor(options: ClientOptions) {}
  public declare_testcase(name: string): void {}
  public forget_testcase(name: string): void {}
  public add_result(key: string, value: unknown): void {}
  public add_assertion(key: string, value: unknown): void {}
  public add_array_element(key: string, value: unknown): void {}
  public add_hit_count(key: string): void {}
  public start_timer(key: string): void {}
  public stop_timer(key: string): void {}
  public post(): boolean {
    return false
  }
}
