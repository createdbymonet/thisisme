import { useEffect, useState } from 'react'
import { AdminShell } from '../../../components/admin/AdminShell'

type Testimonial = { id: string; authorName: string; relationship: string; comment: string; displayPreference: string; status: string; submittedAt: string; reviewedAt: string | null }

export function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  async function load() { try { const response = await fetch('/api/admin/testimonials'); if (!response.ok) throw new Error(); setItems(((await response.json()) as { testimonials: Testimonial[] }).testimonials); setState('ready') } catch { setState('error') } }
  useEffect(() => {
    fetch('/api/admin/testimonials')
      .then(async (response) => { if (!response.ok) throw new Error(); setItems(((await response.json()) as { testimonials: Testimonial[] }).testimonials); setState('ready') })
      .catch(() => setState('error'))
  }, [])
  async function review(id: string, action: 'approve' | 'reject') { const response = await fetch(`/api/admin/testimonials/${id}/${action}`, { method: 'POST' }); if (!response.ok) { setState('error'); return }; await load() }
  const pending = items.filter((item) => item.status === 'pending')
  return <AdminShell route="/admin/testimonials" title="Testimonials" responsiveTitle="Testimonial Management" intro="Review submitted testimonials before publication.">
    {state === 'loading' && <p>Loading testimonials…</p>}{state === 'error' && <p role="alert">Unable to load testimonials.</p>}{state === 'ready' && pending.length === 0 && <p>No testimonials are pending review.</p>}
    <section className="testimonial-list" aria-label="Pending testimonials">{pending.map((item) => <article className="testimonial-card" key={item.id}><h2>{item.authorName} — {item.relationship}</h2><p>{item.comment}</p><small>Name display: {item.displayPreference}; submitted {new Date(item.submittedAt).toLocaleString()}</small><div className="testimonial-actions"><button className="testimonial-action testimonial-action--approve" type="button" onClick={() => review(item.id, 'approve')}>Approve</button><button className="testimonial-action testimonial-action--reject" type="button" onClick={() => review(item.id, 'reject')}>Reject</button></div></article>)}</section>
  </AdminShell>
}
