import type { ReactNode } from 'react'
import type { ContentKey } from '../../content'

type PortfolioCarouselSectionProps = {
  children: ReactNode
  descriptionKey: ContentKey
  id: string
  t: (key: ContentKey) => string
  titleKey: ContentKey
}

type PortfolioCardProps = {
  image?: ReactNode
  children?: ReactNode
  description?: string
  index: number
  meta?: string
  title: string
}

export function PortfolioCarouselSection({ children, descriptionKey, id, t, titleKey }: PortfolioCarouselSectionProps) {
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`

  return <section className="portfolio-section" id={id} aria-labelledby={titleId} aria-describedby={descriptionId} data-analytics-section={id}>
    <div className="portfolio-section__heading">
      <h2 id={titleId}>{t(titleKey)}</h2>
      <p id={descriptionId}>{t(descriptionKey)}</p>
    </div>
    <div className="portfolio-carousel" role="region" aria-label={`${t(titleKey)} — Horizontally scrollable cards`} tabIndex={0}>
      {children}
    </div>
  </section>
}

export function PortfolioCard({ children, description, image, index, meta, title }: PortfolioCardProps) {
  return <article className="portfolio-card" tabIndex={-1}>
    <div className="portfolio-card__topline">
      <span className="portfolio-card__number">{String(index + 1).padStart(2, '0')}</span>
      {meta && <span className="portfolio-card__meta">{meta}</span>}
    </div>
    {image}
    <h3>{title}</h3>
    {description && <p>{description}</p>}
    {children}
  </article>
}
