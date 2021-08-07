// Copyright 2021 Touca, Inc. Subject to Apache-2.0 License.

import { BaseOptions } from './types';
import { readFileSync, statSync } from 'fs';

/**
 *
 */
export interface NodeOptions extends BaseOptions {
  /**
   * determines whether the scope of test case declaration is bound to
   * the thread performing the declaration, or covers all other threads.
   * Defaults to `True`.
   *
   * If set to `True`, when a thread calls {@link declare_testcase}, all
   * other threads also have their most recent test case changed to the
   * newly declared test case and any subsequent call to data capturing
   * functions such as {@link add_result} will affect the newly declared
   * test case.
   */
  concurrency?: boolean;

  /**
   * Path to a configuration file in JSON format with a
   * top-level "touca" field that may list any number of configuration
   * parameters for this function. When used alongside other parameters,
   * those parameters would override values specified in the file.
   */
  file?: string;
}

/**
 *
 */
function _apply_config_file(incoming: NodeOptions): void {
  if (!incoming.file) {
    return;
  }
  if (!statSync(incoming.file).isFile()) {
    throw new Error('file not found');
  }
  const content = readFileSync(incoming.file, { encoding: 'utf8' });
  const parsed = JSON.parse(content);
  if (!parsed.touca) {
    throw new Error('file is missing JSON field: "touca"');
  }
  const config: NodeOptions = parsed.touca;
  for (const key of Object.keys(config) as (keyof NodeOptions)[]) {
    if (!(key in incoming)) {
      incoming[key] = parsed['touca'][key];
    }
  }
}

/**
 *
 */
function _apply_arguments(existing: NodeOptions, incoming: NodeOptions): void {
  //   for params, validate, transform in [
  //     (
  //         ["team", "suite", "version", "api_key", "api_url"],
  //         lambda x: isinstance(x, str),
  //         lambda x: x,
  //     ),
  //     (["offline", "concurrency"], lambda x: isinstance(x, bool), lambda x: x),
  // ]:
  //     for param in params:
  //         if param not in incoming:
  //             continue
  //         value = incoming.get(param)
  //         if not validate(value):
  //             raise ValueError(f"parameter {param} has unexpected type")
  //         existing[param] = transform(value)
}

/**
 *
 */
function _apply_environment_variables(existing: NodeOptions): void {
  const options: Record<string, keyof NodeOptions> = {
    TOUCA_API_KEY: 'api_key',
    TOUCA_API_URL: 'api_url',
    TOUCA_TEST_VERSION: 'version'
  };
  for (const env in options) {
    const value = process.env[env];
    if (value !== undefined) {
      const key: keyof NodeOptions = options[env];
      // existing[key] = value;
    }
  }
}

/**
 *
 */
function _reformat_parameters(existing: NodeOptions): void {
  if (!existing.concurrency) {
    existing.concurrency = true;
  }
  if (!existing.api_url) {
    return;
  }
  const url = new URL(existing.api_url);
  // url = urlparse(api_url)
  // urlpath = [k.strip("/") for k in url.path.split("/@/")]
  // existing["api_url"] = f"{url.scheme}://{url.netloc}/{urlpath[0]}".rstrip("/")
  // if len(urlpath) == 1:
  //     return
  // slugs = [k for k in urlpath[1].split("/") if k]
  // for k, v in list(zip(["team", "suite", "version"], slugs)):
  //     if k in existing and existing.get(k) != v:
  //         raise ValueError(f"option {k} is in conflict with provided api_url")
  //     existing[k] = v
}

/**
 *
 */
function _validate_options(existing: NodeOptions): void {
  const expected_keys: (keyof NodeOptions)[] = ['team', 'suite', 'version'];
  const has_handshake = existing.offline !== true;
  if (has_handshake && ['api_key', 'api_url'].some((k) => k in existing)) {
    expected_keys.push('api_key', 'api_url');
  }
  const key_status: [keyof NodeOptions, boolean][] = expected_keys.map((k) => [
    k,
    k in existing
  ]);
  const values = key_status.map((v) => v[1]);
  if (values.some(Boolean) && !values.every(Boolean)) {
    const keys = key_status.filter((v) => v[1] === false).map((v) => v[0]);
    throw new Error(`missing required option(s) ${keys.join(',')}`);
  }
}

/**
 *
 */
export function update_options(
  existing: NodeOptions,
  incoming: NodeOptions
): void {
  _apply_config_file(incoming);
  _apply_arguments(existing, incoming);
  _apply_environment_variables(existing);
  _reformat_parameters(existing);
  _validate_options(existing);
}
