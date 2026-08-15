const protectedPlaceholders = [
  'Full legal name',
  'Company names',
  'Detailed employment history',
  'Education',
  'Certifications',
  'Detailed career information',
  'Resume download',
]

export function PrivateProfilePage() {
  return (
    <StandalonePage className="private-page" route="/private" title="Private Profile" intro="Protected career information available only after successful company access-code authentication.">
      <section className="protected-preview" aria-labelledby="protected-information-title">
        <h2 id="protected-information-title">Protected information</h2>
        <ul>
          {protectedPlaceholders.map((label) => <li key={label}>{label}<span aria-hidden="true">—</span> locked</li>)}
        </ul>
      </section>
    </StandalonePage>
  )
}
import { StandalonePage } from '../../components/layout/StandalonePage'
