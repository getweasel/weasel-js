// Copyright 2021 Touca, Inc. Subject to Apache-2.0 License.

import { NumberType, ToucaType } from './types';

type Result = {
  key: string;
  value: ToucaType;
};

/**
 *
 */
export class Case {
  private _meta: Record<string, string> = {};
  private _results: Result[] = [];
  private _tics = new Map<string, Date>();
  private _tocs = new Map<string, Date>();

  /**
   *
   */
  constructor(
    private readonly meta: {
      name: string;
      team?: string;
      suite?: string;
      version?: string;
    }
  ) {
    this._meta;
  }

  /**
   * Logs a given value as a test result for the declared test case
   * and associates it with the specified key.
   *
   * @param key name to be associated with the logged test result
   * @param value value to be logged as a test result
   */
  add_result(key: string, value: ToucaType): void {
    this._results.push({ key, value });
  }

  /**
   *
   */
  add_metric(key: string, milliseconds: number): void {
    const tic = new Date();
    this._tics.set(key, tic);
    const toc = new Date(tic);
    toc.setMilliseconds(toc.getMilliseconds() + milliseconds);
    this._tocs.set(key, toc);
  }

  /**
   *
   */
  start_timer(key: string): void {
    this._tics.set(key, new Date());
  }

  /**
   *
   */
  stop_timer(key: string): void {
    if (this._tics.has(key)) {
      this._tocs.set(key, new Date());
    }
  }

  /**
   *
   */
  private _metrics(): [string, ToucaType][] {
    const metrics: [string, ToucaType][] = [];
    for (const [key, tic] of this._tics) {
      if (!this._tocs.has(key)) {
        continue;
      }
      const toc = this._tocs.get(key) as Date;
      const diff = new NumberType(toc.getTime() - tic.getTime());
      metrics.push([key, diff]);
    }
    return metrics;
  }

  /**
   *
   */
  private _metadata(): Record<string, string> {
    return {
      teamslug: this.meta.team ?? 'unknown',
      testsuite: this.meta.suite ?? 'unknown',
      version: this.meta.version ?? 'unknown',
      testcase: this.meta.name ?? 'unknown',
      builtAt: new Date().toUTCString()
    };
  }

  /**
   *
   */
  json(): Record<string, unknown> {
    const results = this._results.map((kvp) => ({
      key: kvp.key,
      value: kvp.value.json()
    }));
    const metrics = this._metrics().map((kvp) => ({
      key: kvp[0],
      value: kvp[1].json()
    }));
    return {
      metadata: this._metadata(),
      results,
      assertions: [],
      metrics
    };
  }
}
