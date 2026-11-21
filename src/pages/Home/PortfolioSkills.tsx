import skillsJson from '../../data/skills.json' with { type: 'json' }
import type { Skill } from '../../data/types'
import type { ContentKey } from '../../content'
import './PortfolioSkills.scss'

const skills: Skill[] = skillsJson
const groups = [
  { label: 'Languages & styling', categories: ['language'] },
  { label: 'Frontend', categories: ['frontend'] },
  { label: 'Backend', categories: ['backend'] },
  { label: 'Testing', categories: ['engineering'] },
  { label: 'Tools & platforms', categories: ['tooling', 'platform'] },
]
// These technologies are explicitly named in the current professional role.
const featuredSkills = new Set(['typescript', 'vue-js'])

export function PortfolioSkills({ t }: { t: (key: ContentKey) => string }) {
  return <section className="portfolio-section" id="skills" aria-labelledby="skills-title" data-analytics-section="skills">
    <div className="portfolio-section__heading">
      <h2 id="skills-title">{t('nav.skills')}</h2>
    </div>
    <div className="portfolio-skill-groups">
      {groups.map((group) => <div className="portfolio-skill-group" key={group.label}>
        <h3>{group.label}</h3>
        <ul className="portfolio-skills" role="list">
          {skills.filter((skill) => group.categories.includes(skill.category)).map((skill) => <li className={`portfolio-skill${featuredSkills.has(skill.id) ? ' portfolio-skill--featured' : ''}`} key={skill.id}>
            <span>{skill.name}</span>
          </li>)}
        </ul>
      </div>)}
    </div>
  </section>
}
