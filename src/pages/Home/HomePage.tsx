import { appSettings } from '../../config/appSettings'
import experienceJson from '../../data/experience.json' with { type: 'json' }
import type { Experience } from '../../data/types'
import { getText, type ContentKey } from '../../content'
import { PortfolioCard, PortfolioCarouselSection } from './PortfolioCarousel'
import { PortfolioHeader } from './PortfolioHeader'
import { PortfolioImage } from './PortfolioImage'
import { PortfolioSkills } from './PortfolioSkills'
import './HomePage.scss'

const navigation: Array<{ labelKey: ContentKey; id: string }> = [
  { labelKey: 'nav.skills', id: 'skills' },
  { labelKey: 'nav.experience', id: 'experience' },
  { labelKey: 'nav.projects', id: 'projects' },
  { labelKey: 'nav.about', id: 'about' },
  { labelKey: 'nav.contact', id: 'contact' },
]

const experience = experienceJson as Experience[]

const projects: Array<{ titleKey: ContentKey; descriptionKey: ContentKey; href?: string; linkLabelKey?: ContentKey }> = [
  { titleKey: 'projects.thisIsMe.title', descriptionKey: 'projects.thisIsMe.description', href: appSettings.contact.githubUrl, linkLabelKey: 'projects.viewSource' },
  { titleKey: 'projects.catfolio.title', descriptionKey: 'projects.catfolio.description' },
]

const aboutItems: Array<{ titleKey: ContentKey; descriptionKey?: ContentKey }> = [
  { titleKey: 'about.calgary.title', descriptionKey: 'about.calgary.description' },
  { titleKey: 'about.cats.title', descriptionKey: 'about.cats.description' },
  { titleKey: 'about.basketball.title', descriptionKey: 'about.basketball.description' },
  { titleKey: 'about.hiking.title', descriptionKey: 'about.hiking.description' },
  { titleKey: 'about.videoGames.title' },
]

function PortfolioBackground() {
  return <picture className="portfolio-background" aria-hidden="true">
    <source media="(min-width: 1024px)" srcSet="/thisisme_garibaldi.jpg" />
    <img src="/thisisme_sumihana.jpg" alt="" />
  </picture>
}

export function HomePage() {
  const t = getText

  return <div className="portfolio-home" lang="en">
    <PortfolioBackground />
    <div className="portfolio-home__inner">
      <PortfolioHeader navigation={navigation} t={t} />

      <main id="top">
        <section className="portfolio-hero" aria-labelledby="hero-title" data-analytics-section="hero">
          <p className="portfolio-pill">{t('hero.location')}</p>
          <h1 id="hero-title">{t('hero.title')}</h1>
          <p className="portfolio-hero__summary">{t('hero.summary')}</p>
          <PortfolioImage kind="profile" placeholderLabel="place holder" />
          <div className="portfolio-hero__actions">
            <a className="portfolio-button portfolio-button--primary" href="#projects">{t('hero.viewWork')}</a>
          </div>
        </section>

        <PortfolioSkills t={t} />

        <PortfolioCarouselSection id="experience" titleKey="nav.experience" descriptionKey="experience.carouselIntro" t={t}>
          {experience.map((item, index) => <PortfolioCard description={t(item.descriptionKey)} index={index} key={item.id} title={t(item.roleKey)} />)}
        </PortfolioCarouselSection>

        <PortfolioCarouselSection id="projects" titleKey="nav.projects" descriptionKey="projects.carouselIntro" t={t}>
          {projects.map((project, index) => <PortfolioCard description={t(project.descriptionKey)} index={index} key={project.titleKey} title={t(project.titleKey)} image={<PortfolioImage kind="project" placeholderLabel="place holder" />}>
            {project.href && project.linkLabelKey && <a className="portfolio-card__link" href={project.href} target="_blank" rel="noopener noreferrer">{t(project.linkLabelKey)}<span aria-hidden="true"> ↗</span></a>}
          </PortfolioCard>)}
        </PortfolioCarouselSection>

        <PortfolioCarouselSection id="about" titleKey="nav.about" descriptionKey="about.carouselIntro" t={t}>
          {aboutItems.map((item, index) => <PortfolioCard description={item.descriptionKey ? t(item.descriptionKey) : undefined} index={index} key={item.titleKey} title={t(item.titleKey)} />)}
        </PortfolioCarouselSection>

        <section className="portfolio-contact" id="contact" aria-labelledby="contact-title" data-analytics-section="contact">
          <p>{t('contact.eyebrow')}</p>
          <h2 id="contact-title">{t('nav.contact')}</h2>
          <p className="portfolio-contact__intro">{t('contact.intro')}</p>
          <div className="portfolio-contact__links" role="group" aria-label="Profile links">
            <a href={appSettings.contact.githubUrl} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
            <a href={appSettings.contact.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
          </div>
          <p className="portfolio-contact__footer">{t('contact.siteName')} — {t('contact.footer')}</p>
        </section>
      </main>
    </div>
  </div>
}
