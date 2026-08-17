import type { TranslationKey } from '../i18n'

export type Skill = {
  id: string
  name: string
  category: string
  experienceType: 'professional' | 'learning'
}

export type Experience = {
  id: string
  roleKey: TranslationKey
  summaryKey: TranslationKey
}
