import type { ReactNode } from 'react'
import type { TranslationKey } from '../../i18n'

type PortfolioCarouselSectionProps = {
  children: ReactNode
  descriptionKey: TranslationKey
  id: string
  t: (key: TranslationKey) => string
  titleKey: TranslationKey
}

type PortfolioCardProps = {
  children?: ReactNode
  description: string
  index: number
  meta?: string
  title: string
}

export function PortfolioCarouselSection({ children, descriptionKey, id, t, titleKey }: PortfolioCarouselSectionProps) {
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`

  return <section className="portfolio-section" id={id} aria-labelledby={titleId} aria-describedby={descriptionId} data-analytics-section={id}>
    <div className="portfolio-section__heading">
      <p className="portfolio-section__eyebrow">{t('sections.eyebrow')}</p>
      <h2 id={titleId}>{t(titleKey)}</h2>
      <p id={descriptionId}>{t(descriptionKey)}</p>
    </div>
    <div className="portfolio-carousel" role="region" aria-label={`${t(titleKey)} — ${t('sections.carouselLabel')}`} tabIndex={0}>
      {children}
    </div>
  </section>
}

export function PortfolioCard({ children, description, index, meta, title }: PortfolioCardProps) {
  return <article className="portfolio-card" tabIndex={-1}>
    <div className="portfolio-card__topline">
      <span className="portfolio-card__number">{String(index + 1).padStart(2, '0')}</span>
      {meta && <span className="portfolio-card__meta">{meta}</span>}
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
    {children}
  </article>
}
