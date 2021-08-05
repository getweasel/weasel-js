// Copyright 2021 Touca, Inc. Subject to Apache-2.0 License.

type Result = {
  key: string;
  value: unknown;
};

export class Case {
  private _results: Result[] = [];
  constructor(private readonly slug: string) {}
  add_result(key: string, value: unknown): void {
    this._results.push({ key, value });
  }
}
