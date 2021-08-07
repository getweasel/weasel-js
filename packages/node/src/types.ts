// Copyright 2021 Touca, Inc. Subject to Apache-2.0 License.

/**
 *
 */
export interface BaseOptions {
  /**
   * API Key issued by the Touca server that
   * identifies who is submitting the data. Since the value should be
   * treated as a secret, we recommend that you pass it as an environment
   * variable `TOUCA_API_KEY` instead.
   */
  api_key?: string;

  /**
   * URL to the Touca server API. Can be provided either in long
   * format like `https://api.touca.io/@/myteam/mysuite/version` or in short
   * format like `https://api.touca.io`. If the team, suite, or version are
   * specified, you do not need to specify them separately.
   */
  api_url?: string;

  /**
   * determines whether client should connect with the Touca server during
   * the configuration. Defaults to `false` when `api_url` or `api_key` are
   * provided.
   */
  offline?: boolean;

  /**
   * slug of the suite on the Touca server that corresponds to your
   * workflow under test.
   */
  suite?: string;

  /** slug of your team on the Touca server. */
  team?: string;

  /** version of your workflow under test. */
  version?: string;
}

/**
 *
 */
export interface BaseClient<Options extends BaseOptions> {
  configure(options: Options): void;
  is_configured(): boolean;
  configuration_error(): string;
  get_testcases(): PromiseLike<string[]>;
  declare_testcase(slug: string): void;
  forget_testcase(slug: string): void;
  add_result(key: string, value: unknown): void;
  add_assertion(key: string, value: unknown): void;
  add_array_element(key: string, value: unknown): void;
  add_hit_count(key: string): void;
  add_metric(key: string, milliseconds: number): void;
  start_timer(key: string): void;
  stop_timer(key: string): void;
  post(): PromiseLike<boolean>;
  seal(): PromiseLike<boolean>;
}
