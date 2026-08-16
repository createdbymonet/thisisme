import { useEffect, useState, type PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

export function AdminRoute({ children }: PropsWithChildren) {
  const [state, setState] = useState<'loading' | 'authenticated' | 'unauthenticated' | 'error'>('loading')

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/admin/session', { signal: controller.signal })
      .then((response) => setState(response.ok ? 'authenticated' : response.status === 401 ? 'unauthenticated' : 'error'))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setState('error')
      })
    return () => controller.abort()
  }, [])

  if (state === 'loading') return <main className="admin-route-state">Checking administrator session…</main>
  if (state === 'unauthenticated') return <Navigate to="/manage-portal" replace />
  if (state === 'error') return <main className="admin-route-state">Unable to verify the administrator session.</main>
  return children
}
