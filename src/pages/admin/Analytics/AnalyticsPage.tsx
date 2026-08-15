import { AdminShell } from '../../../components/admin/AdminShell'

const companyAnalytics = [
  { company: 'Company A', sessions: '3', section: 'Projects', time: '08:12', privateAccess: 'Yes', resume: 'Yes' },
  { company: 'Company B', sessions: '1', section: 'Experience', time: '03:44', privateAccess: 'Yes', resume: 'No' },
  { company: 'Company C', sessions: '2', section: 'Skills', time: '05:09', privateAccess: 'No', resume: 'No' },
]

const sectionEngagement = [
  { label: 'Projects', value: 82 },
  { label: 'Experience', value: 68 },
  { label: 'Skills', value: 54 },
  { label: 'Private Profile', value: 46 },
  { label: 'About', value: 29 },
]

export function AnalyticsPage() {
  return (
    <AdminShell
      route="/admin/analytics"
      title="Analytics"
      responsiveTitle="Access Analytics"
      intro="Company-level engagement: sessions, viewed sections, estimated time, private-profile access, and resume downloads."
    >
      <div className="analytics-filters" aria-label="Analytics filters">
        <button type="button">Company: All</button>
        <button type="button">Period: Last 30 days</button>
        <button type="button">Event: All</button>
      </div>

      <section className="analytics-records" aria-label="Company analytics">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th scope="col">Company</th>
              <th scope="col">Sessions</th>
              <th scope="col">Top section</th>
              <th scope="col">Time</th>
              <th scope="col">Private</th>
              <th scope="col">Resume</th>
            </tr>
          </thead>
          <tbody>
            {companyAnalytics.map((row) => (
              <tr key={row.company}>
                <td data-label="Company">{row.company}</td>
                <td data-label="Sessions">{row.sessions}</td>
                <td data-label="Top section">{row.section}</td>
                <td data-label="Time">{row.time}</td>
                <td data-label="Private">{row.privateAccess}</td>
                <td data-label="Resume">{row.resume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section-engagement" aria-labelledby="section-engagement-title">
        <h2 id="section-engagement-title">Section engagement</h2>
        <ul>
          {sectionEngagement.map((section) => (
            <li key={section.label}>
              <span className="engagement-label">{section.label}</span>
              <div
                className="engagement-track"
                role="img"
                aria-label={`${section.value}% engagement`}
              >
                <span className={`engagement-bar engagement-bar--${section.value}`} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </AdminShell>
  )
}
