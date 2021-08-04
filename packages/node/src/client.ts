// Copyright 2021 Touca, Inc. Subject to Apache-2.0 License.

import { BaseClient, BaseOptions } from './types';

type Result = {
  key: string;
  value: unknown;
};

class Element {
  private _results: Result[] = [];
  constructor(private readonly slug: string) {}
  add_result(key: string, value: unknown): void {
    this._results.push({ key, value });
  }
}

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
  private _parse_error: string | null = null;
  private _configured = false;
  private _elements = new Map<string, Element>();
  private _active_element: string | null = null;

  public init(options: NodeOptions): void {}

  public testcase(slug: string): void {
    if (!this._configured) {
      return;
    }
    if (!this._elements.has(slug)) {
      this._elements.set(slug, new Element(slug));
    }
    this._active_element = slug;
  }

  public add_result(key: string, value: unknown): void {
    if (this._active_element) {
      this._elements.get(this._active_element)?.add_result(key, value);
    }
  }

  public async post(timeout?: number): Promise<boolean> {
    return false;
  }
}
