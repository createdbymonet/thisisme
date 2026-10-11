import skillsJson from '../../data/skills.json' with { type: 'json' }
import type { Skill } from '../../data/types'
import type { ContentKey } from '../../content'
import './PortfolioSkills.scss'

const skills = skillsJson as Skill[]
const labelKeys: Record<Skill['experienceTypes'][number], ContentKey> = {
  work: 'skills.experience.work',
  personal: 'skills.experience.personal',
  volunteer: 'skills.experience.volunteer',
}

export function PortfolioSkills({ t }: { t: (key: ContentKey) => string }) {
  return <section className="portfolio-section" id="skills" aria-labelledby="skills-title" aria-describedby="skills-description" data-analytics-section="skills">
    <div className="portfolio-section__heading">
      <h2 id="skills-title">{t('nav.skills')}</h2>
      <p id="skills-description">{t('skills.gridIntro')}</p>
    </div>
    <ul className="portfolio-skills" role="list">
      {skills.map((skill) => <li className="portfolio-skill" key={skill.id}>
        <h3>{skill.name}</h3>
        <ul className="portfolio-skill__labels" role="list">
          {skill.experienceTypes.map((type) => <li key={type}>{t(labelKeys[type])}</li>)}
        </ul>
      </li>)}
    </ul>
  </section>
}
