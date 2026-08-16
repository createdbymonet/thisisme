import { useEffect, useState, type FormEvent } from 'react'
import { AdminShell } from '../../../components/admin/AdminShell'

type AccessCode = { accessCodeId: string; companyName: string; isActive: boolean; expiresAt: string; createdAt: string; lastUsedAt: string | null; useCount: number }

export function AccessCodesPage() {
  const [items, setItems] = useState<AccessCode[]>([])
  const [companyName, setCompanyName] = useState('')
  const [oneTimeCode, setOneTimeCode] = useState<string | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  async function load() { try { const response = await fetch('/api/admin/access-codes'); if (!response.ok) throw new Error(); setItems(((await response.json()) as { accessCodes: AccessCode[] }).accessCodes); setState('ready') } catch { setState('error') } }
  useEffect(() => {
    fetch('/api/admin/access-codes')
      .then(async (response) => { if (!response.ok) throw new Error(); setItems(((await response.json()) as { accessCodes: AccessCode[] }).accessCodes); setState('ready') })
      .catch(() => setState('error'))
  }, [])
  async function create(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const response = await fetch('/api/admin/access-codes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ companyName }) }); if (!response.ok) { setState('error'); return }; setOneTimeCode(((await response.json()) as { accessCode: string }).accessCode); setCompanyName(''); await load() }
  async function reissue(id: string) { if (!confirm('The old access code will stop working. Reissue it?')) return; const response = await fetch(`/api/admin/access-codes/${id}/reissue`, { method: 'POST' }); if (!response.ok) { setState('error'); return }; setOneTimeCode(((await response.json()) as { accessCode: string }).accessCode); await load() }
  async function toggle(item: AccessCode) { const response = await fetch(`/api/admin/access-codes/${item.accessCodeId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !item.isActive, expiresAt: item.expiresAt }) }); if (!response.ok) { setState('error'); return }; await load() }
  return <AdminShell route="/admin/access-codes" title="Access Codes" responsiveTitle="Access Code Management" intro="Create and manage company-specific access codes.">
    <form className="access-code-form" onSubmit={create}><label htmlFor="company-name">Company name</label><input id="company-name" minLength={2} maxLength={160} required value={companyName} onChange={(event) => setCompanyName(event.target.value)} /><button className="button button--accent" type="submit">Create access code</button></form>
    {oneTimeCode && <section className="one-time-code" aria-live="polite"><strong>Copy this code now. It cannot be recovered.</strong><code>{oneTimeCode}</code><button type="button" onClick={() => void navigator.clipboard.writeText(oneTimeCode)}>Copy</button><button type="button" onClick={() => setOneTimeCode(null)}>Dismiss</button></section>}
    {state === 'loading' && <p>Loading access codes…</p>}{state === 'error' && <p role="alert">Unable to load access codes.</p>}{state === 'ready' && items.length === 0 && <p>No access codes have been issued.</p>}
    {state === 'ready' && items.length > 0 && <section className="access-codes-list" aria-label="Existing access codes"><table className="admin-data-table"><thead><tr><th>Company</th><th>Status</th><th>Expires</th><th>Last access</th><th>Views</th><th>Actions</th></tr></thead><tbody>{items.map((item) => <tr key={item.accessCodeId}><td data-label="Company">{item.companyName}</td><td data-label="Status">{item.isActive ? 'Active' : 'Inactive'}</td><td data-label="Expires">{new Date(item.expiresAt).toLocaleDateString()}</td><td data-label="Last access">{item.lastUsedAt ? new Date(item.lastUsedAt).toLocaleDateString() : 'Never'}</td><td data-label="Views">{item.useCount}</td><td data-label="Actions"><button type="button" onClick={() => toggle(item)}>{item.isActive ? 'Deactivate' : 'Activate'}</button> <button type="button" onClick={() => reissue(item.accessCodeId)}>Reissue</button></td></tr>)}</tbody></table></section>}
  </AdminShell>
}
