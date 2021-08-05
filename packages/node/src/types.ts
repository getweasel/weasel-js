// Copyright 2021 Touca, Inc. Subject to Apache-2.0 License.

/**
 *
 */
export interface BaseOptions {
  api_key?: string;
  api_url?: string;
  concurrency?: boolean;
  file?: string;
  offline?: string;
  suite?: string;
  team?: string;
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
  post(): PromiseLike<boolean>;
  seal(): PromiseLike<boolean>;
}
