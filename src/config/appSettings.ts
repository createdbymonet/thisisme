import appSettingsJson from '../../appsettings.json' with { type: 'json' }

export type SupportedLanguage = 'en' | 'ja'

export type AppSettings = {
  application: {
    defaultLanguage: SupportedLanguage
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
}

function isSupportedLanguage(value: string): value is SupportedLanguage {
  return value === 'en' || value === 'ja'
}

const configuredLanguage = appSettingsJson.application.defaultLanguage

export const appSettings: AppSettings = {
  application: {
    defaultLanguage: isSupportedLanguage(configuredLanguage) ? configuredLanguage : 'en',
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
}
