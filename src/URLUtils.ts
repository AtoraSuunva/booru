type Stringable = string | number | boolean
type Arrayable<T> = T | T[]
type Optional<T> = T | undefined

export function querystring(
  query: Record<string, Optional<Arrayable<Stringable>>>,
): string {
  return Object.entries(query)
    .filter(notOptionalEntry)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${
          Array.isArray(value)
            ? value.map(encodeURIComponent).join('+')
            : encodeURIComponent(value)
        }`,
    )
    .join('&')
}

function notOptionalEntry<T>(
  entry: [string, Optional<T>],
): entry is [string, T] {
  return entry[1] !== undefined
}
