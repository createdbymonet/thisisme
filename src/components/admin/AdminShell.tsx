import type { PropsWithChildren } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const adminNavigation = [
  ['Overview', '/admin'],
  ['Access Codes', '/admin/access-codes'],
  ['Analytics', '/admin/analytics'],
  ['Testimonials', '/admin/testimonials'],
  ['Settings', '/admin/settings'],
] as const

type AdminShellProps = PropsWithChildren<{
  route: string
  title: string
  responsiveTitle?: string
  intro: string
}>

export function AdminShell({ route, title, responsiveTitle = title, intro, children }: AdminShellProps) {
  const navigate = useNavigate()
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    navigate('/manage-portal', { replace: true })
  }
  return <div className="admin-dashboard">
    <header className="admin-topbar"><strong>This is me Admin</strong><span>{route}</span><button type="button" onClick={logout}>Log out</button></header>
    <div className="admin-shell">
      <nav className="admin-sidebar" aria-label="Admin navigation">
        {adminNavigation.map(([label, path]) => <NavLink end={path === '/admin'} to={path} key={path}>{label}</NavLink>)}
      </nav>
      <main className="admin-content">
        <h1><span className="admin-title__desktop">{title}</span><span className="admin-title__responsive">{responsiveTitle}</span></h1>
        <p className="admin-content__intro">{intro}</p>
        {children}
      </main>
    </div>
  </div>
}
