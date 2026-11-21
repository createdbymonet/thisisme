import { appSettings } from '../../config/appSettings'
import { getText, type ContentKey } from '../../content'
import { PortfolioCard, PortfolioCarouselSection } from './PortfolioCarousel'
import { PortfolioExperience } from './PortfolioExperience'
import { PortfolioImage } from './PortfolioImage'
import { PortfolioSkills } from './PortfolioSkills'
import './HomePage.scss'

const projects: Array<{ titleKey: ContentKey; descriptionKey: ContentKey; image: { src: string; alt: string; objectPosition?: string }; technologies?: string[]; links: Array<{ href: string; labelKey: ContentKey }> }> = [
  {
    titleKey: 'projects.catfolio.title',
    descriptionKey: 'projects.catfolio.description',
    image: { src: '/catfolio.png', alt: 'Catfolio welcome screen with its cat logo and care, health and memories tagline.' },
    technologies: ['Vue 3', 'TypeScript', 'Vue Router', 'SCSS'],
    links: [
      { href: 'https://catfolio.sumihana.workers.dev/dashboard', labelKey: 'projects.liveDemo' },
      { href: 'https://github.com/createdbymonet/catfolio', labelKey: 'projects.github' },
    ],
  },
  {
    titleKey: 'projects.familyHub.title',
    descriptionKey: 'projects.familyHub.description',
    image: { src: '/family_hub.png', alt: 'Family Hub home screen with Shopping List and Thanks Board cards.', objectPosition: 'center' },
    technologies: ['Angular', 'TypeScript', 'SCSS'],
    links: [
      { href: 'https://family-hub.sumihana.workers.dev/', labelKey: 'projects.liveDemo' },
      { href: 'https://github.com/createdbymonet/family-hub', labelKey: 'projects.github' },
    ],
  },
  {
    titleKey: 'projects.improveTracker.title',
    descriptionKey: 'projects.improveTracker.description',
    image: { src: '/improve_tracker.png', alt: 'Improve Tracker vocabulary card with a meaning, example sentence, Japanese translation and notes.', objectPosition: 'center top' },
    technologies: ['Svelte', 'TypeScript', 'SCSS', 'Vite'],
    links: [
      { href: 'https://improve-tracker.sumihana.workers.dev/', labelKey: 'projects.liveDemo' },
      { href: 'https://github.com/createdbymonet/improve-tracker', labelKey: 'projects.github' },
    ],
  },
  { titleKey: 'projects.thisIsMe.title', descriptionKey: 'projects.thisIsMe.description', image: { src: '/thisisme.png', alt: 'This is me portfolio showing the developer introduction and grouped skills over a mountain lake background.' }, technologies: ['React', 'TypeScript', 'SCSS', 'Cloudflare Workers'], links: [{ href: appSettings.contact.githubUrl, labelKey: 'projects.viewSource' }] },
]

function PortfolioBackground() {
  return <picture className="portfolio-background" aria-hidden="true">
    <source media="(min-width: 1024px)" srcSet="/thisisme_garibaldi.jpg" />
    <img src="/thisisme_sumihana.jpg" alt="" />
  </picture>
}

export function HomePage() {
  const t = getText
  const [heroFocus, ...heroRole] = t('hero.title').split(' ')

  return <div className="portfolio-home" lang="en">
    <PortfolioBackground />
    <div className="portfolio-home__content">
      <div className="portfolio-home__inner">
        <main id="top">
          <section className="portfolio-hero" aria-labelledby="hero-title" data-analytics-section="hero">
            <p className="portfolio-pill">{t('hero.location')}</p>
            <h1 id="hero-title"><span className="portfolio-hero__title-part">{heroFocus}</span>{' '}<span className="portfolio-hero__title-part">{heroRole.join(' ')}</span></h1>
            <p className="portfolio-hero__summary">{t('hero.summary')}</p>
            <div className="portfolio-hero__actions">
              <a className="portfolio-button portfolio-button--primary" href="#projects">{t('hero.viewWork')}</a>
            </div>
          </section>

          <PortfolioSkills t={t} />

          <PortfolioExperience t={t} />

          <PortfolioCarouselSection id="projects" titleKey="nav.projects" t={t} showScrollIndicator>
            {projects.map((project, index) => <PortfolioCard description={t(project.descriptionKey)} technologies={project.technologies} index={index} key={project.titleKey} title={t(project.titleKey)} image={<PortfolioImage {...project.image} placeholderLabel={t('projects.imagePlaceholder')} />}>
              <div className="portfolio-card__actions">
                {project.links.map((link) => <a className="portfolio-card__link" href={link.href} key={link.labelKey} target="_blank" rel="noopener noreferrer" aria-label={`${t(project.titleKey)} ${t(link.labelKey)}`}>{t(link.labelKey)}<span aria-hidden="true"> ↗</span></a>)}
              </div>
            </PortfolioCard>)}
          </PortfolioCarouselSection>

          <section className="portfolio-contact" id="contact" aria-labelledby="contact-title" data-analytics-section="contact">
            <p id="contact-title">{t('contact.eyebrow')}</p>
            <div className="portfolio-contact__links" role="group" aria-label="Profile links">
              <a href={appSettings.contact.githubUrl} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
              <a href={appSettings.contact.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
            </div>
            <p className="portfolio-contact__footer">{t('contact.siteName')} — {t('contact.footer')}</p>
          </section>
        </main>
      </div>
    </div>
  </div>
}
