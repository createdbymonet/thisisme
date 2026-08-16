import { useEffect, useState } from 'react'
import { AdminShell } from '../../../components/admin/AdminShell'

type Summary = { sessionCount: number; companyCount: number; pageViews: number; privateProfileViews: number; resumeDownloads: number; estimatedEngagementMs: number }
type CompanyAnalytics = { companyCode: string; companyName: string; sessionCount: number; lastActivity: string; pageViews: Record<string, number>; sectionViews: Record<string, number>; estimatedEngagementMs: number; privateProfileViews: number; resumeDownloads: number }

function duration(milliseconds: number) {
  const seconds = Math.round(milliseconds / 1000)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

export function AnalyticsPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [companies, setCompanies] = useState<CompanyAnalytics[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  useEffect(() => {
    Promise.all([fetch('/api/admin/analytics/summary'), fetch('/api/admin/analytics/companies')])
      .then(async ([summaryResponse, companiesResponse]) => {
        if (!summaryResponse.ok || !companiesResponse.ok) throw new Error()
        setSummary(await summaryResponse.json() as Summary)
        setCompanies(((await companiesResponse.json()) as { companies: CompanyAnalytics[] }).companies)
        setState('ready')
      })
      .catch(() => setState('error'))
  }, [])
  return <AdminShell route="/admin/analytics" title="Analytics" responsiveTitle="Access Analytics" intro="Privacy-conscious company-level aggregate engagement.">
    {state === 'loading' && <p>Loading analytics…</p>}
    {state === 'error' && <p role="alert">Unable to load analytics.</p>}
    {state === 'ready' && summary && <section className="dashboard-metrics" aria-label="Analytics summary">
      <article className="metric-card metric-card--paper"><p>Authorized sessions</p><strong>{summary.sessionCount}</strong></article>
      <article className="metric-card metric-card--blue"><p>Companies</p><strong>{summary.companyCount}</strong></article>
      <article className="metric-card metric-card--accent"><p>Page views</p><strong>{summary.pageViews}</strong></article>
      <article className="metric-card metric-card--warm"><p>Estimated engagement</p><strong>{duration(summary.estimatedEngagementMs)}</strong></article>
    </section>}
    {state === 'ready' && companies.length === 0 && <p>No authorized company analytics have been recorded.</p>}
    {state === 'ready' && companies.length > 0 && <section className="analytics-records" aria-label="Company analytics"><table className="admin-data-table"><thead><tr><th>Company</th><th>Sessions</th><th>Top section</th><th>Estimated time</th><th>Private views</th><th>Resume</th></tr></thead><tbody>{companies.map((company) => {
      const topSection = Object.entries(company.sectionViews).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
      return <tr key={company.companyCode}><td data-label="Company">{company.companyName}</td><td data-label="Sessions">{company.sessionCount}</td><td data-label="Top section">{topSection}</td><td data-label="Estimated time">{duration(company.estimatedEngagementMs)}</td><td data-label="Private views">{company.privateProfileViews}</td><td data-label="Resume">{company.resumeDownloads}</td></tr>
    })}</tbody></table></section>}
  </AdminShell>
}
