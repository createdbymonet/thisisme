import { StandalonePage } from '../../../components/layout/StandalonePage'

export function AdminLoginPage() {
  return (
    <StandalonePage className="manage-portal-page" route="/manage-portal" title="Admin Login" intro="Special administrator entry URL. The URL itself does not grant access; administrator authentication will be required.">
      <form className="admin-login-card">
        <label className="visually-hidden" htmlFor="admin-identity">Admin email / username</label>
        <input id="admin-identity" name="adminIdentity" type="text" autoComplete="off" placeholder="Admin email / username" />
        <label className="visually-hidden" htmlFor="admin-password">Password</label>
        <input id="admin-password" name="adminPassword" type="password" autoComplete="off" placeholder="Password" />
        <button className="button button--accent admin-login-card__button" type="button">Sign in</button>
      </form>
    </StandalonePage>
  )
}
