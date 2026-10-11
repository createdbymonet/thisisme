import content from './locales/en.json' with { type: 'json' }

type StringLeafPath<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends Record<string, unknown>
      ? `${K}.${StringLeafPath<T[K]>}`
      : never
}[keyof T & string]

export type ContentKey = StringLeafPath<typeof content>

export function getText(key: ContentKey) {
  let value: unknown = content
  for (const segment of key.split('.')) {
    if (typeof value !== 'object' || value === null || !(segment in value)) {
      throw new Error(`Missing content key: ${key}`)
    }
    value = (value as Record<string, unknown>)[segment]
  }
  if (typeof value !== 'string') {
    throw new Error(`Content key is not a string: ${key}`)
  }
  return value
}
