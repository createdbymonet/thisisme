import { StandalonePage } from '../../components/layout/StandalonePage'

export function AccessPage() {
  return (
    <StandalonePage className="access-page" route="/access" title="Access" intro="Company-specific access code entry for protected professional information. Authentication is not implemented yet.">
      <form className="access-card">
        <h2>Enter your access code</h2>
        <label className="visually-hidden" htmlFor="company-access-code">Company access code</label>
        <input id="company-access-code" name="companyAccessCode" type="text" autoComplete="off" placeholder="Company access code" />
        <button className="button button--accent access-card__button" type="button">Unlock Private Profile</button>
        <p>If you do not have an access code, contact me through the public portfolio.</p>
      </form>
    </StandalonePage>
  )
}
