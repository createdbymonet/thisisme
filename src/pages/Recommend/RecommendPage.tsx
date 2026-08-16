import { useState, type FormEvent } from 'react'
import { appSettings, type SupportedLanguage } from '../../config/appSettings'
import { StandalonePage } from '../../components/layout/StandalonePage'
import { translate, type TranslationKey } from '../../i18n'
import { usePageAnalytics } from '../../analytics'

type DisplayPreference = 'full_name' | 'partial_name' | 'anonymous'

export function RecommendPage() {
  usePageAnalytics('recommend')
  const [language, setLanguage] = useState<SupportedLanguage>(appSettings.application.defaultLanguage)
  const [authorName, setAuthorName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [comment, setComment] = useState('')
  const [displayPreference, setDisplayPreference] = useState<DisplayPreference>('partial_name')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)
  const t = (key: TranslationKey) => translate(language, key)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return
    if (authorName.trim().length < 2 || relationship.trim().length < 2 || comment.trim().length < 10) {
      setMessage({ kind: 'error', text: t('recommend.error.validation') })
      return
    }

    setIsSubmitting(true)
    setMessage(null)
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName, relationship, comment, displayPreference }),
      })
      if (!response.ok) throw new Error('Submission failed')
      setAuthorName('')
      setRelationship('')
      setComment('')
      setDisplayPreference('partial_name')
      setMessage({ kind: 'success', text: t('recommend.success') })
    } catch {
      setMessage({ kind: 'error', text: t('recommend.error.server') })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <StandalonePage className="recommend-page" route="/recommend" title={t('recommend.title')} intro={t('recommend.intro')}>
      <div className="recommend-language" aria-label={t('recommend.language')}>
        <button type="button" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
        <span aria-hidden="true">|</span>
        <button type="button" aria-pressed={language === 'ja'} onClick={() => setLanguage('ja')}>日本語</button>
      </div>
      <form className="recommend-form" onSubmit={submit}>
        <label className="visually-hidden" htmlFor="display-name">{t('recommend.authorName')}</label>
        <input id="display-name" name="authorName" type="text" autoComplete="name" minLength={2} maxLength={100} required placeholder={t('recommend.authorName')} value={authorName} onChange={(event) => setAuthorName(event.target.value)} />
        <label className="visually-hidden" htmlFor="relationship">{t('recommend.relationship')}</label>
        <input id="relationship" name="relationship" type="text" minLength={2} maxLength={120} required placeholder={t('recommend.relationship')} value={relationship} onChange={(event) => setRelationship(event.target.value)} />
        <label className="visually-hidden" htmlFor="testimonial">{t('recommend.comment')}</label>
        <textarea id="testimonial" name="comment" minLength={10} maxLength={2000} required placeholder={t('recommend.comment')} value={comment} onChange={(event) => setComment(event.target.value)} />
        <fieldset className="recommend-form__preferences">
          <legend>{t('recommend.displayPreference')}</legend>
          {(['full_name', 'partial_name', 'anonymous'] as const).map((preference) => (
            <label key={preference}>
              <input type="radio" name="displayPreference" value={preference} checked={displayPreference === preference} onChange={() => setDisplayPreference(preference)} />
              <span>{t(`recommend.displayPreference.${preference}`)}</span>
            </label>
          ))}
        </fieldset>
        <p className="recommend-form__note">{t('recommend.expectation')}</p>
        {message && <p className={`recommend-form__message recommend-form__message--${message.kind}`} role={message.kind === 'error' ? 'alert' : 'status'}>{message.text}</p>}
        <button className="button button--accent recommend-form__submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('recommend.submitting') : t('recommend.submit')}
        </button>
      </form>
    </StandalonePage>
  )
}
