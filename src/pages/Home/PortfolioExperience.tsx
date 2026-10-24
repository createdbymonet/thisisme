import { useId, useState } from 'react'
import type { ContentKey } from '../../content'
import experienceJson from '../../data/experience.json' with { type: 'json' }
import type { Experience } from '../../data/types'
import './PortfolioExperience.scss'

type PortfolioExperienceProps = {
  t: (key: ContentKey) => string
}

const experience = experienceJson as Experience[]

function ExperienceItem({ item, t }: PortfolioExperienceProps & { item: Experience }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const id = useId()
  const triggerId = `${id}-trigger`
  const panelId = `${id}-panel`

  return <li className="portfolio-experience__item">
    <h3 className="portfolio-experience__heading">
      <button
        className="portfolio-experience__trigger"
        type="button"
        id={triggerId}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        <span>{t(item.roleKey)}</span>
        <span className="portfolio-experience__indicator" aria-hidden="true">{isExpanded ? '−' : '+'}</span>
      </button>
    </h3>
    <div
      className="portfolio-experience__panel"
      id={panelId}
      role="region"
      aria-labelledby={triggerId}
      aria-hidden={!isExpanded}
      inert={!isExpanded}
      data-expanded={isExpanded}
    >
      <div className="portfolio-experience__panel-inner">
        <div className="portfolio-experience__details">
          <p>{t(item.descriptionKey)}</p>
        </div>
      </div>
    </div>
  </li>
}

export function PortfolioExperience({ t }: PortfolioExperienceProps) {
  return <section className="portfolio-section" id="experience" aria-labelledby="experience-title" data-analytics-section="experience">
    <div className="portfolio-section__heading">
      <h2 id="experience-title">{t('nav.experience')}</h2>
    </div>
    <ul className="portfolio-experience">
      {experience.map((item) => <ExperienceItem item={item} key={item.id} t={t} />)}
    </ul>
  </section>
}
