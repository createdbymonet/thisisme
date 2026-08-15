import { AdminShell } from '../../../components/admin/AdminShell'

const accessCodes = [
  ['Company A', 'Active', 'Sep 30, 2026', 'Aug 15', '5'],
  ['Company B', 'Active', 'Oct 15, 2026', 'Aug 12', '2'],
  ['Company C', 'Expired', 'Aug 10, 2026', 'Never', '0'],
]

export function AccessCodesPage() {
  return <AdminShell route="/admin/access-codes" title="Access Codes" responsiveTitle="Access Code Management" intro="Create and manage company-specific access codes.">
    <button className="button button--accent access-codes-create" type="button">Create access code</button>
    <section className="access-codes-list" aria-label="Existing access codes">
      <table className="admin-data-table">
        <thead><tr><th scope="col">Company</th><th scope="col">Status</th><th scope="col">Expires</th><th scope="col">Last access</th><th scope="col">Views</th></tr></thead>
        <tbody>{accessCodes.map(([company, status, expires, lastAccess, views]) => <tr key={company}><td data-label="Company">{company}</td><td data-label="Status">{status}</td><td data-label="Expires">{expires}</td><td data-label="Last access">{lastAccess}</td><td data-label="Views">{views}</td></tr>)}</tbody>
      </table>
    </section>
  </AdminShell>
}
