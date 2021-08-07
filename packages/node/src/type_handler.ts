// Copyright 2021 Touca, Inc. Subject to Apache-2.0 License.

/**
 *
 */
interface ToucaType {
  json(): void;
  serialize(): void;
}

/**
 *
 */
class BoolType implements ToucaType {
  constructor(private value: boolean) {}
  public json(): string {
    return '';
  }
  public serialize() {
    return '';
  }
}

/**
 *
 */
export class TypeHandler {
  private readonly _primitives = new Map<string, ToucaType>([]);
  private _types = new Map<string, () => Record<string, unknown>>([]);

  /**
   *
   */
  public transform(value: unknown): ToucaType {
    return new BoolType(true);
  }

  /**
   *
   */
  public add_serializer(
    datatype: string,
    serializer: () => Record<string, unknown>
  ): void {
    this._types.set(datatype, serializer);
  }
}
