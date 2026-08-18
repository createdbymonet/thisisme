import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StandalonePage } from '../../components/layout/StandalonePage'
import { usePageAnalytics, useSectionAnalytics } from '../../analytics'
import { appSettings, type SupportedLanguage } from '../../config/appSettings'
import { translate, type TranslationKey } from '../../i18n'

type PrivateProfile = {
  legalName: string
  employment: string[]
  education: string[]
  certifications: string[]
  resume: string | null
}

type ProfileState =
  | { status: 'loading' }
  | { status: 'authorized'; profile: PrivateProfile | null }
  | { status: 'unauthorized' }
  | { status: 'failed' }

export function PrivateProfilePage() {
  usePageAnalytics('private')
  useSectionAnalytics('private')
  const [state, setState] = useState<ProfileState>({ status: 'loading' })
  const [language, setLanguage] = useState<SupportedLanguage>(appSettings.application.defaultLanguage)
  const t = (key: TranslationKey) => translate(language, key)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProfile() {
      try {
        const response = await fetch('/api/private-profile', {
          credentials: 'same-origin',
          signal: controller.signal,
        })

        if (response.status === 401) {
          setState({ status: 'unauthorized' })
          return
        }

        if (!response.ok) {
          setState({ status: 'failed' })
          return
        }

        const data = await response.json() as { profile: PrivateProfile | null }
        setState({ status: 'authorized', profile: data.profile })
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setState({ status: 'failed' })
        }
      }
    }

    void loadProfile()
    return () => controller.abort()
  }, [])

  return (
    <StandalonePage className="private-page" route="/private" title="Private Profile" intro="Protected career information available only after successful company access-code authentication.">
      <section className="protected-preview" aria-labelledby="protected-information-title" data-analytics-section="protected-profile">
        <h2 id="protected-information-title">Protected information</h2>
        {state.status === 'loading' && <p>Loading protected profile…</p>}
        {state.status === 'unauthorized' && <p>This information is locked. <Link to="/access">Enter an access code</Link>.</p>}
        {state.status === 'failed' && <p>Protected information could not be loaded. Please try again later.</p>}
        {state.status === 'authorized' && !state.profile && <p>No protected profile is available yet.</p>}
        {state.status === 'authorized' && state.profile && <ul>
          <li><strong>Legal name</strong><span>{state.profile.legalName}</span></li>
          <li><strong>Employment</strong><span>{state.profile.employment.join(' • ') || 'Not provided'}</span></li>
          <li><strong>Education</strong><span>{state.profile.education.join(' • ') || 'Not provided'}</span></li>
          <li><strong>Certifications</strong><span>{state.profile.certifications.join(' • ') || 'Not provided'}</span></li>
          <li><strong>Resume</strong><span>{state.profile.resume ?? 'Not provided'}</span></li>
        </ul>}
        {state.status === 'authorized' && <>
          <div className="language" aria-label="Resume language / レジュメの言語">
            <button type="button" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
            <span aria-hidden="true">|</span>
            <button type="button" aria-pressed={language === 'ja'} onClick={() => setLanguage('ja')}>日本語</button>
          </div>
          <div className="button-row">
            <a className="button" href="/api/private/resume" target="_blank" rel="noopener noreferrer">{t('privateProfile.viewResume')}</a>
            <a className="button" href="/api/private/resume?download=true" download="moe-oishi-resume.pdf">{t('privateProfile.downloadResume')}</a>
          </div>
        </>}
      </section>
    </StandalonePage>
  )
}
