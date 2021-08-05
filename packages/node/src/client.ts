// Copyright 2021 Touca, Inc. Subject to Apache-2.0 License.

import { BaseClient, BaseOptions } from './types';
import { Case } from './case';
import { Transport } from './transport';

/**
 *
 */
export interface NodeOptions extends BaseOptions {
  debug?: boolean;
}

/**
 *
 */
export class NodeClient implements BaseClient<NodeOptions> {
  private _cases = new Map<string, Case>();
  private _configured = false;
  private _configuration_error = '';
  private _options: NodeOptions = {};
  private _parse_error: string | null = null;
  private _active_case: string | null = null;
  private _transport: Transport | null = null;

  /**
   * Configures the Touca client. Must be called before declaring test cases
   * and adding results to the client. Should be regarded as a potentially
   * expensive operation. Should be called only from your test environment.
   *
   * {@link configure} takes a variety of configuration parameters
   * documented below. All of these parameters are optional. Calling this
   * function without any parameters is possible: the client can capture
   * behavior and performance data and store them on a local filesystem
   * but it will not be able to post them to the Touca server.
   *
   * In most cases, You will need to pass API Key and API URL during the
   * configuration. The code below shows the common pattern in which API URL
   * is given in long format (it includes the team slug and the suite slug)
   * and API Key as well as the version of the code under test are specified
   * as environment variables ``TOUCA_API_KEY`` and ``TOUCA_TEST_VERSION``,
   * respectively:
   *
   * ```
   * touca.configure(api_url='https://api.touca.io/@/acme/students')
   * ```
   *
   * As long as the API Key and API URL to the Touca server are known to
   * the client, it attempts to perform a handshake with the Touca Server to
   * authenticate with the server and obtain the list of known test cases
   * for the baseline version of the specified suite. You can explicitly
   * disable this handshake in rare cases where you want to prevent ever
   * communicating with the Touca server.
   *
   * You can call {@link configure} any number of times. The client
   * preserves the configuration parameters specified in previous calls to
   * this function.
   *
   * @return ``True`` if client is ready to capture data.
   */
  public configure(options: NodeOptions): void {}

  /**
   * Checks if previous call(s) to {@link configure} have set the right
   * combination of configuration parameters to enable the client to perform
   * expected tasks.
   *
   * We recommend that you perform this check after client configuration and
   * before calling other functions of the library:
   *
   * ```
   * if (!touca.is_configured()) {
   *   console.log(configuration_error());
   * }
   * ```
   *
   * At a minimum, the client is considered configured if it can capture
   * test results and store them locally on the filesystem. A single call
   * to {@link configure} without any configuration parameters can help
   * us get to this state. However, if a subsequent call to {@link configure}
   * sets the parameter ``api_url`` in short form without specifying
   * parameters such as ``team``, ``suite`` and ``version``, the client
   * configuration is incomplete: We infer that the user intends to submit
   * results but the provided configuration parameters are not sufficient
   * to perform this operation.
   *
   * @return ``True`` if the client is properly configured
   * @see {@link configure}
   */
  public is_configured(): boolean {
    return this._configured;
  }

  /**
   * Provides the most recent error, if any, that is encountered during
   * client configuration.
   *
   * @returns short description of the most recent configuration error
   */
  public configuration_error(): string {
    return this._configuration_error;
  }

  /**
   * Queries the Touca server for the list of testcases that are submitted
   * to the baseline version of this suite.
   *
   * @throws when called on the client that is not configured to communicate
   *         with the Touca server.
   *
   * @returns list of test cases of the baseline version of this suite
   */
  public async get_testcases(): Promise<string[]> {
    if (!this._transport) {
      throw new Error('client not configured to perform this operation');
    }
    return this._transport.get_testcases();
  }

  /**
   * Declares name of the test case to which all subsequent results will be
   * submitted until a new test case is declared.
   *
   * If configuration parameter ``concurrency`` is set to ``"enabled"``, when
   * a thread calls `declare_testcase` all other threads also have their most
   * recent testcase changed to the newly declared one. Otherwise, each
   * thread will submit to its own testcase.
   *
   * @param slug slug of the testcase to be declared
   */
  public declare_testcase(slug: string): void {
    if (!this._configured) {
      return;
    }
    if (!this._cases.has(slug)) {
      this._cases.set(slug, new Case(slug));
    }
    this._active_case = slug;
  }

  /**
   * Removes all logged information associated with a given test case.
   *
   * This information is removed from memory, such that switching back to
   * an already-declared or already-submitted test case would behave similar
   * to when that test case was first declared. This information is removed,
   * for all threads, regardless of the configuration option ``concurrency``.
   * Information already submitted to the server will not be removed from
   * the server.
   *
   * This operation is useful in long-running regression test frameworks,
   * after submission of test case to the server, if memory consumed by
   * the client library is a concern or if there is a risk that a future
   * test case with a similar name may be executed.
   *
   * @param slug slug of the testcase to be removed from memory
   */
  public forget_testcase(slug: string): void {
    if (!this._cases.has(slug)) {
      throw new Error(`test case ${slug} was never declared`);
    }
    this._cases.delete(slug);
  }

  /**
   * Logs a given value as a test result for the declared test case and
   * associates it with the specified key.
   *
   * @param key name to be associated with the logged test result
   * @param value value to be logged as a test result
   */
  public add_result(key: string, value: unknown): void {
    if (this._active_case) {
      this._cases.get(this._active_case)?.add_result(key, value);
    }
  }

  /**
   * Submits all test results recorded so far to Touca server.
   *
   * It is possible to call {@link post} multiple times during runtime
   * of the regression test tool. Test cases already submitted to the server
   * whose test results have not changed, will not be resubmitted.
   * It is also possible to add test results to a testcase after it is
   * submitted to the server. Any subsequent call to {@link post} will
   * resubmit the modified test case.
   *
   * @throws when called on the client that is not configured to communicate
   *         with the Touca server.
   *
   * @returns a promise that is resolved when all test results are submitted.
   */
  public async post(): Promise<boolean> {
    if (!this._transport) {
      throw new Error('client not configured to perform this operation');
    }
    if (!this._transport.has_token()) {
      throw new Error('client not authenticated');
    }
    // @TODO
    return this._transport.post('');
  }

  /**
   * Notifies the Touca server that all test cases were executed for this
   * version and no further test result is expected to be submitted.
   * Expected to be called by the test tool once all test cases are executed
   * and all test results are posted.
   *
   * Sealing the version is optional. The Touca server automatically
   * performs this operation once a certain amount of time has passed since
   * the last test case was submitted. This duration is configurable from
   * the "Settings" tab in "Suite" Page.
   *
   * @throws when called on the client that is not configured to communicate
   *         with the Touca server.
   *
   * @returns a promise that is resolved when all test results are submitted.
   */
  public async seal(): Promise<boolean> {
    if (!this._transport) {
      throw new Error('client not configured to perform this operation');
    }
    if (!this._transport.has_token()) {
      throw new Error('client not authenticated');
    }
    return this._transport.seal();
  }
}
