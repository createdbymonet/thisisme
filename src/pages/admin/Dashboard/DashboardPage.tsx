import { AdminShell } from '../../../components/admin/AdminShell'

const metrics = [
  { label: 'Companies accessed', value: '4', note: 'Last 30 days', tone: 'paper' },
  { label: 'Private profile views', value: '12', note: 'Last 30 days', tone: 'blue' },
  { label: 'Resume downloads', value: '3', note: 'Last 30 days', tone: 'accent' },
  { label: 'Pending testimonials', value: '2', note: 'Needs review', tone: 'warm' },
]

const activity = [
  ['Company A', 'Viewed Private Profile', '2 hours ago'],
  ['Company B', 'Viewed Projects', 'Yesterday'],
  ['Company C', 'Downloaded Resume', '3 days ago'],
]

export function DashboardPage() {
  return <AdminShell route="/admin" title="Overview" responsiveTitle="Overview Dashboard" intro="High-level portfolio engagement and recent activity.">
    <section className="dashboard-metrics" aria-label="Overview metrics">
      {metrics.map((metric) => <article className={`metric-card metric-card--${metric.tone}`} key={metric.label}><p>{metric.label}</p><strong>{metric.value}</strong><small>{metric.note}</small></article>)}
    </section>
    <section className="recent-activity" aria-labelledby="recent-activity-title">
      <h2 id="recent-activity-title">Recent activity</h2>
      <table className="admin-data-table">
        <thead><tr><th scope="col">Company</th><th scope="col">Activity</th><th scope="col">When</th></tr></thead>
        <tbody>{activity.map(([company, action, when]) => <tr key={company}><td data-label="Company">{company}</td><td data-label="Activity">{action}</td><td data-label="When">{when}</td></tr>)}</tbody>
      </table>
    </section>
  </AdminShell>
}
