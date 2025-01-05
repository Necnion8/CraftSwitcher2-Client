export type CamelCase<T> =
  T extends Record<string, unknown>
    ? { [K in keyof T]: CamelCase<T[K]> }
    : T extends (infer U)[]
      ? U extends Record<string, unknown>
        ? CamelCase<U>[]
        : T
      : T;

export function toCamelCase<T extends Record<string, unknown>>(obj: T): CamelCase<T> {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase) as unknown as CamelCase<T>;
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([-_][a-z])/g, (group) =>
          group.toUpperCase().replace('-', '').replace('_', '')
        ),
        toCamelCase(value as Record<string, unknown>),
      ])
    ) as unknown as CamelCase<T>;
  }
  return obj as CamelCase<T>;
}
