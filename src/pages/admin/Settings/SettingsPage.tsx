import { AdminShell } from '../../../components/admin/AdminShell'

const settingGroups = [
  {
    title: 'Access code defaults',
    settings: ['Default expiration period', 'Default active state'],
  },
  {
    title: 'Analytics',
    settings: ['Retention period', 'Company-level tracking only'],
  },
  {
    title: 'Private profile',
    settings: ['Resume availability', 'Protected information visibility'],
  },
  {
    title: 'Administrator',
    settings: ['Authentication settings', 'Session settings'],
  },
]

export function SettingsPage() {
  return (
    <AdminShell
      route="/admin/settings"
      title="Settings"
      responsiveTitle="Admin Settings"
      intro="Administrator and application settings for later implementation."
    >
      <div className="settings-groups">
        {settingGroups.map((group) => (
          <section className="settings-group" key={group.title} aria-labelledby={`settings-${group.title.toLowerCase().replaceAll(' ', '-')}`}>
            <h2 id={`settings-${group.title.toLowerCase().replaceAll(' ', '-')}`}>{group.title}</h2>
            {group.settings.map((setting) => (
              <div className="setting-row" key={setting}>
                <span>{setting}</span>
                <span className="setting-row__value">Placeholder</span>
              </div>
            ))}
          </section>
        ))}
      </div>
    </AdminShell>
  )
}
