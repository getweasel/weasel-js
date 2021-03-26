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
  private _parse_error: string | null = null
  private _configured = false

  /**
   * @brief Configures the weasel client.
   *
   * @param options configuration parameters
   */
  constructor(options: ClientOptions | ConfigurationFile) {
    if (typeof options === 'string') {
      return
    }
  }

  /**
   * @brief Checks if the client is configured to perform basic operations.
   *
   * @return true if weasel client is properly configured
   */
  public is_configured(): boolean {
    return this._configured
  }

  /**
   * @brief Provides the most recent error, if any, encountered during
   *        client configuration.
   *
   * @return short description of the most recent configuration error
   */
  public configuration_error(): string | null {
    return this._parse_error
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
  public async save_binary(key: string): Promise<void> {}
  public async save_json(key: string): Promise<void> {}
  public async post(): Promise<boolean> {
    return false
  }
  public async seal(): Promise<boolean> {
    return false
  }
}
