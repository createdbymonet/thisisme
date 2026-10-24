import skillsJson from '../../data/skills.json' with { type: 'json' }
import type { Skill } from '../../data/types'
import type { ContentKey } from '../../content'
import './PortfolioSkills.scss'

const skills: Skill[] = skillsJson

export function PortfolioSkills({ t }: { t: (key: ContentKey) => string }) {
  return <section className="portfolio-section" id="skills" aria-labelledby="skills-title" data-analytics-section="skills">
    <div className="portfolio-section__heading">
      <h2 id="skills-title">{t('nav.skills')}</h2>
    </div>
    <ul className="portfolio-skills" role="list">
      {skills.map((skill) => <li className="portfolio-skill" key={skill.id}>
        <h3>{skill.name}</h3>
      </li>)}
    </ul>
  </section>
}
