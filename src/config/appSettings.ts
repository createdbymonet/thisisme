import appSettingsJson from '../../appsettings.json' with { type: 'json' }

export type SupportedLanguage = 'en' | 'ja'

export type AppSettings = {
  application: {
    defaultLanguage: SupportedLanguage
  }
  contact: {
    githubUrl: string
  }
  security: {
    encryptionVersion: number
  }
  accessCode: {
    defaultExpirationDays: number
  }
  protectedProfile: {
    sessionLifetimeMinutes: number
  }
  admin: {
    sessionLifetimeMinutes: number
  }
  analytics: {
    enabled: boolean
    retentionDays: number
  }
}

function isSupportedLanguage(value: string): value is SupportedLanguage {
  return value === 'en' || value === 'ja'
}

const configuredLanguage = appSettingsJson.application.defaultLanguage

export const appSettings: AppSettings = {
  application: {
    defaultLanguage: isSupportedLanguage(configuredLanguage) ? configuredLanguage : 'en',
  },
  contact: {
    githubUrl: appSettingsJson.contact.githubUrl,
  },
  security: {
    encryptionVersion: appSettingsJson.security.encryptionVersion,
  },
  accessCode: {
    defaultExpirationDays: appSettingsJson.accessCode.defaultExpirationDays,
  },
  protectedProfile: {
    sessionLifetimeMinutes: appSettingsJson.protectedProfile.sessionLifetimeMinutes,
  },
  admin: {
    sessionLifetimeMinutes: appSettingsJson.admin.sessionLifetimeMinutes,
  },
  analytics: {
    enabled: appSettingsJson.analytics.enabled,
    retentionDays: appSettingsJson.analytics.retentionDays,
  },
}
