import type { ContentKey } from '../content'

export type Skill = {
  id: string
  name: string
  category: string
}

export type Experience = {
  id: string
  roleKey: ContentKey
  descriptionKey?: ContentKey
  organization?: string
  period?: string
  highlights?: string[]
  technologies?: string[]
  isCurrent?: boolean
}
