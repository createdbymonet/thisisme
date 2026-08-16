import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { StandalonePage } from '../../../components/layout/StandalonePage'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [credential, setCredential] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setError('')
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential }) })
      if (!response.ok) throw new Error('Authentication failed')
      setCredential('')
      navigate('/admin', { replace: true })
    } catch {
      setError('Unable to authenticate.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <StandalonePage className="manage-portal-page" route="/manage-portal" title="Admin Login" intro="Authenticate to access administrative tools.">
      <form className="admin-login-card" onSubmit={submit}>
        <label className="visually-hidden" htmlFor="admin-credential">Administrator credential</label>
        <input id="admin-credential" name="credential" type="password" autoComplete="current-password" minLength={16} maxLength={512} required placeholder="Administrator credential" value={credential} onChange={(event) => setCredential(event.target.value)} />
        {error && <p className="admin-form-message" role="alert">{error}</p>}
        <button className="button button--accent admin-login-card__button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </StandalonePage>
  )
}
