import { appSettings } from '../../config/appSettings'
import { getText, type ContentKey } from '../../content'
import { PortfolioCard, PortfolioCarouselSection } from './PortfolioCarousel'
import { PortfolioExperience } from './PortfolioExperience'
import { PortfolioImage } from './PortfolioImage'
import { PortfolioSkills } from './PortfolioSkills'
import './HomePage.scss'

const projects: Array<{ titleKey: ContentKey; descriptionKey: ContentKey; links: Array<{ href: string; labelKey: ContentKey }> }> = [
  {
    titleKey: 'projects.catfolio.title',
    descriptionKey: 'projects.catfolio.description',
    links: [
      { href: 'https://catfolio.sumihana.workers.dev/dashboard', labelKey: 'projects.liveDemo' },
      { href: 'https://github.com/createdbymonet/catfolio', labelKey: 'projects.github' },
    ],
  },
  {
    titleKey: 'projects.familyHub.title',
    descriptionKey: 'projects.familyHub.description',
    links: [
      { href: 'https://family-hub.sumihana.workers.dev/', labelKey: 'projects.liveDemo' },
      { href: 'https://github.com/createdbymonet/family-hub', labelKey: 'projects.github' },
    ],
  },
  {
    titleKey: 'projects.improveTracker.title',
    descriptionKey: 'projects.improveTracker.description',
    links: [
      { href: 'https://improve-tracker.sumihana.workers.dev/', labelKey: 'projects.liveDemo' },
      { href: 'https://github.com/createdbymonet/improve-tracker', labelKey: 'projects.github' },
    ],
  },
  {
    titleKey: 'projects.myTools.title',
    descriptionKey: 'projects.myTools.description',
    links: [
      { href: 'https://github.com/createdbymonet/my-tools', labelKey: 'projects.github' },
    ],
  },
  { titleKey: 'projects.thisIsMe.title', descriptionKey: 'projects.thisIsMe.description', links: [{ href: appSettings.contact.githubUrl, labelKey: 'projects.viewSource' }] },
]

const aboutItems: Array<{ titleKey: ContentKey; descriptionKey?: ContentKey }> = [
  { titleKey: 'about.calgary.title', descriptionKey: 'about.calgary.description' },
  { titleKey: 'about.cats.title', descriptionKey: 'about.cats.description' },
  { titleKey: 'about.basketball.title', descriptionKey: 'about.basketball.description' },
  { titleKey: 'about.hiking.title', descriptionKey: 'about.hiking.description' },
  { titleKey: 'about.videoGames.title', descriptionKey: 'about.videoGames.description' },
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
      <main id="top">
        <section className="portfolio-hero" aria-labelledby="hero-title" data-analytics-section="hero">
          <p className="portfolio-pill">{t('hero.location')}</p>
          <h1 id="hero-title">{t('hero.title')}</h1>
          <p className="portfolio-hero__summary">{t('hero.summary')}</p>
          <div className="portfolio-hero__actions">
            <a className="portfolio-button portfolio-button--primary" href="#projects">{t('hero.viewWork')}</a>
          </div>
        </section>

        <PortfolioSkills t={t} />

        <PortfolioExperience t={t} />

        <PortfolioCarouselSection id="projects" titleKey="nav.projects" t={t}>
          {projects.map((project, index) => <PortfolioCard description={t(project.descriptionKey)} index={index} key={project.titleKey} title={t(project.titleKey)} image={<PortfolioImage placeholderLabel={t('projects.imagePlaceholder')} />}>
            <div className="portfolio-card__actions">
              {project.links.map((link) => <a className="portfolio-card__link" href={link.href} key={link.labelKey} target="_blank" rel="noopener noreferrer" aria-label={`${t(project.titleKey)} ${t(link.labelKey)}`}>{t(link.labelKey)}<span aria-hidden="true"> ↗</span></a>)}
            </div>
          </PortfolioCard>)}
        </PortfolioCarouselSection>

        <PortfolioCarouselSection id="about" titleKey="nav.about" t={t}>
          {aboutItems.map((item, index) => <PortfolioCard description={item.descriptionKey ? t(item.descriptionKey) : undefined} index={index} key={item.titleKey} title={t(item.titleKey)} />)}
        </PortfolioCarouselSection>

        <section className="portfolio-contact" id="contact" aria-labelledby="contact-title" data-analytics-section="contact">
          <p>{t('contact.eyebrow')}</p>
          <h2 id="contact-title">{t('nav.contact')}</h2>
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
