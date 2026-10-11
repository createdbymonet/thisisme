import appSettingsJson from '../../appsettings.json' with { type: 'json' }


export type AppSettings = {
  contact: {
    linkedinUrl: string
    githubUrl: string
  }
}

export const appSettings: AppSettings = {
  contact: {
    linkedinUrl: appSettingsJson.contact.linkedinUrl,
    githubUrl: appSettingsJson.contact.githubUrl,
  },
}
