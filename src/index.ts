/**
 * Copyright 2018-2020 Pejman Ghorbanzade. All rights reserved.
 */

/**
 *
 */
export interface ClientOptions {
  apiKey?: string
  apiUrl?: string
  version?: string
  suite?: string
  team?: string
  handshake?: boolean
  postTestcases?: number
  postMaxRetries?: number
  concurrencyMode?: 'all-threads' | 'per-thread'
}

export type ConfigurationFile = string

/**
 *
 */
export class Client {
  constructor(options: ClientOptions | ConfigurationFile) {
    if (typeof options === 'string') {
      return
    }
  }
  public is_configured(): boolean {
    return false
  }
  public configuration_error(): string | null {
    return ''
  }
  public add_logger(): void {}
  public declare_testcase(name: string): void {}
  public forget_testcase(name: string): void {}
  public add_result(key: string, value: unknown): void {}
  public add_assertion(key: string, value: unknown): void {}
  public add_array_element(key: string, value: unknown): void {}
  public add_hit_count(key: string): void {}
  public add_metric(key: string): void {}
  public start_timer(key: string): void {}
  public stop_timer(key: string): void {}
  public save_binary(key: string): void {}
  public save_json(key: string): void {}
  public post(): boolean {
    return false
  }
  public seal(): boolean {
    return false
  }
}
