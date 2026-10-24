import type { ContentKey } from '../content'

export type Skill = {
  id: string
  name: string
  category: string
}

export type Experience = {
  id: string
  roleKey: ContentKey
  descriptionKey: ContentKey
}
