declare module "bun:test" {
  export const describe: (name: string, fn: () => void) => void;
  export const it: (
    name: string,
    fn: () => void | Promise<void>,
  ) => void;

  interface Matchers<R> {
    toBe(expected: unknown): R;
    toBeNull(): R;
    toBeUndefined(): R;
    toBeNaN(): R;
    toBeDefined(): R;
    toBeFalsy(): R;
    toBeTruthy(): R;
    toEqual(expected: unknown): R;
    toStrictEqual(expected: unknown): R;
    toHaveLength(length: number): R;
    toMatch(pattern: string | RegExp): R;
    toHaveProperty(keyPath: string | string[], value?: unknown): R;
    toMatchObject(expected: object): R;
    toThrow(error?: unknown): R;
    toBeInstanceOf(expected: new (...args: unknown[]) => unknown): R;
    toContain(expected: unknown): R;
    toContainEqual(expected: unknown): R;
    toHaveBeenCalled(): R;
    toHaveBeenCalledWith(...args: unknown[]): R;
    toHaveBeenLastCalledWith(...args: unknown[]): R;
    toHaveBeenCalledTimes(count: number): R;
    toHaveBeenNthCalledWith(n: number, ...args: unknown[]): R;
    toMatchSnapshot(): R;
    toMatchInlineSnapshot(snapshot?: string): R;
  }

  type ExpectResult = Matchers<void> & {
    not: Matchers<void>;
    resolves: Matchers<Promise<void>>;
    rejects: Matchers<Promise<void>>;
  };

  export const expect: (value: unknown) => ExpectResult;
  export const mock: {
    module: (name: string, factory: () => Record<string, unknown>) => void;
  };
}
