import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { StandalonePage } from '../../components/layout/StandalonePage'

export function AccessPage() {
  const navigate = useNavigate()
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/access/validate', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode }),
      })

      if (!response.ok) {
        setError(response.status === 401 ? 'Invalid or expired access code.' : 'Unable to verify access right now.')
        return
      }

      setAccessCode('')
      navigate('/private', { replace: true })
    } catch {
      setError('Unable to verify access right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <StandalonePage className="access-page" route="/access" title="Access" intro="Enter your company-specific access code to view protected professional information.">
      <form className="access-card" onSubmit={handleSubmit}>
        <h2>Enter your access code</h2>
        <label className="visually-hidden" htmlFor="company-access-code">Company access code</label>
        <input id="company-access-code" name="companyAccessCode" type="password" autoComplete="off" placeholder="Company access code" value={accessCode} onChange={(event) => setAccessCode(event.target.value)} disabled={isSubmitting} required />
        <button className="button button--accent access-card__button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Checking…' : 'Unlock Private Profile'}</button>
        {error && <p className="form-error" role="alert">{error}</p>}
        <p>If you do not have an access code, contact me through the public portfolio.</p>
      </form>
    </StandalonePage>
  )
}
