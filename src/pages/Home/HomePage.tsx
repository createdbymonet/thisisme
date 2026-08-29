import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageAnalytics, useSectionAnalytics } from '../../analytics'
import { appSettings, type SupportedLanguage } from '../../config/appSettings'
import experienceJson from '../../data/experience.json' with { type: 'json' }
import skillsJson from '../../data/skills.json' with { type: 'json' }
import type { Experience, Skill } from '../../data/types'
import { translate, type TranslationKey } from '../../i18n'
import { PortfolioCard, PortfolioCarouselSection } from './PortfolioCarousel'
import { PortfolioHeader } from './PortfolioHeader'

const navigation: Array<{ labelKey: TranslationKey; id: string }> = [
  { labelKey: 'nav.skills', id: 'skills' },
  { labelKey: 'nav.experience', id: 'experience' },
  { labelKey: 'nav.projects', id: 'projects' },
  { labelKey: 'nav.about', id: 'about' },
  { labelKey: 'nav.testimonials', id: 'testimonials' },
  { labelKey: 'nav.contact', id: 'contact' },
]

const skills = skillsJson as Skill[]
const experience = experienceJson as Experience[]

const projects: Array<{ title: string; descriptionKey: TranslationKey; href?: string; linkLabelKey?: TranslationKey }> = [
  { title: 'This is me', descriptionKey: 'projects.thisIsMe.description', href: appSettings.contact.githubUrl, linkLabelKey: 'projects.viewSource' },
  { title: 'catfolio', descriptionKey: 'projects.catfolio.description' },
  { title: 'Social Bridge Canada', descriptionKey: 'projects.socialBridge.description' },
]

const aboutItems: Array<{ titleKey: TranslationKey; descriptionKey: TranslationKey }> = [
  { titleKey: 'about.cats.title', descriptionKey: 'about.cats.description' },
  { titleKey: 'about.basketball.title', descriptionKey: 'about.basketball.description' },
  { titleKey: 'about.hiking.title', descriptionKey: 'about.hiking.description' },
  { titleKey: 'about.calgary.title', descriptionKey: 'about.calgary.description' },
]

type PublicTestimonial = {
  authorName: string | null
  isAnonymous: boolean
  relationship: string
  comment: string
}

type TestimonialState =
  | { status: 'loading' }
  | { status: 'ready'; testimonials: PublicTestimonial[] }
  | { status: 'failed' }

function isPublicTestimonialResponse(value: unknown): value is { testimonials: PublicTestimonial[] } {
  if (typeof value !== 'object' || value === null || !('testimonials' in value) || !Array.isArray(value.testimonials)) return false

  return value.testimonials.every((testimonial) => (
    typeof testimonial === 'object'
    && testimonial !== null
    && ('authorName' in testimonial && (typeof testimonial.authorName === 'string' || testimonial.authorName === null))
    && ('isAnonymous' in testimonial && typeof testimonial.isAnonymous === 'boolean')
    && ('relationship' in testimonial && typeof testimonial.relationship === 'string')
    && ('comment' in testimonial && typeof testimonial.comment === 'string')
  ))
}

function PortfolioBackground() {
  return <picture className="portfolio-background" aria-hidden="true">
    <source media="(min-width: 1024px)" srcSet="/thisisme_garibaldi.jpg" />
    <img src="/thisisme_sumihana.jpg" alt="" />
  </picture>
}

export function HomePage() {
  usePageAnalytics('home')
  useSectionAnalytics('home')
  const [language, setLanguage] = useState<SupportedLanguage>(appSettings.application.defaultLanguage)
  const [testimonialState, setTestimonialState] = useState<TestimonialState>({ status: 'loading' })
  const t = (key: TranslationKey) => translate(language, key)

  useEffect(() => {
    const controller = new AbortController()

    async function loadTestimonials() {
      try {
        const response = await fetch('/api/testimonials', { signal: controller.signal })
        if (!response.ok) {
          setTestimonialState({ status: 'failed' })
          return
        }

        const data = await response.json() as unknown
        if (!isPublicTestimonialResponse(data)) {
          setTestimonialState({ status: 'failed' })
          return
        }

        setTestimonialState({ status: 'ready', testimonials: data.testimonials })
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setTestimonialState({ status: 'failed' })
        }
      }
    }

    void loadTestimonials()
    return () => controller.abort()
  }, [])

  return <div className="portfolio-home">
    <PortfolioBackground />
    <div className="portfolio-home__inner">
      <PortfolioHeader language={language} navigation={navigation} onLanguageChange={setLanguage} t={t} />

      <main id="top">
        <section className="portfolio-hero" aria-labelledby="hero-title" data-analytics-section="hero">
          <p className="portfolio-pill">
            <span className="portfolio-desktop-only">{t('hero.locationDesktop')}</span>
            <span className="portfolio-compact-only">{t('hero.locationCompact')}</span>
          </p>
          <h1 id="hero-title">
            <span className="portfolio-desktop-only">{t('hero.titleDesktop')}</span>
            <span className="portfolio-compact-only">{t('hero.titleCompact')}</span>
          </h1>
          <p className="portfolio-hero__summary">{t('hero.summary')}</p>
          <div className="portfolio-hero__actions">
            <a className="portfolio-button portfolio-button--primary" href="#projects">{t('hero.viewWork')}</a>
            <Link className="portfolio-button portfolio-button--secondary" to="/access">{t('nav.privateProfile')}</Link>
          </div>
        </section>

        <PortfolioCarouselSection id="skills" titleKey="skills.title" descriptionKey="skills.carouselIntro" t={t}>
          {skills.map((skill, index) => <PortfolioCard
            description={t(skill.descriptionKey)}
            index={index}
            key={skill.id}
            meta={t(skill.experienceType === 'professional' ? 'skills.professionalBadge' : 'skills.learningBadge')}
            title={skill.name}
          />)}
        </PortfolioCarouselSection>

        <PortfolioCarouselSection id="experience" titleKey="experience.title" descriptionKey="experience.carouselIntro" t={t}>
          {experience.map((item, index) => <PortfolioCard description={t(item.descriptionKey)} index={index} key={item.id} title={t(item.roleKey)} />)}
        </PortfolioCarouselSection>

        <PortfolioCarouselSection id="projects" titleKey="projects.title" descriptionKey="projects.carouselIntro" t={t}>
          {projects.map((project, index) => <PortfolioCard description={t(project.descriptionKey)} index={index} key={project.title} title={project.title}>
            {project.href && project.linkLabelKey && <a className="portfolio-card__link" href={project.href} target="_blank" rel="noopener noreferrer">{t(project.linkLabelKey)}<span aria-hidden="true"> ↗</span></a>}
          </PortfolioCard>)}
        </PortfolioCarouselSection>

        <PortfolioCarouselSection id="about" titleKey="about.title" descriptionKey="about.carouselIntro" t={t}>
          {aboutItems.map((item, index) => <PortfolioCard description={t(item.descriptionKey)} index={index} key={item.titleKey} title={t(item.titleKey)} />)}
        </PortfolioCarouselSection>

        <PortfolioCarouselSection id="testimonials" titleKey="testimonials.title" descriptionKey="testimonials.carouselIntro" t={t}>
          {testimonialState.status === 'loading' && <p className="portfolio-carousel__status" role="status">{t('testimonials.loading')}</p>}
          {testimonialState.status === 'failed' && <p className="portfolio-carousel__status" role="alert">{t('testimonials.failure')}</p>}
          {testimonialState.status === 'ready' && testimonialState.testimonials.length === 0 && <p className="portfolio-carousel__status">{t('testimonials.empty')}</p>}
          {testimonialState.status === 'ready' && testimonialState.testimonials.map((testimonial, index) => (
            <PortfolioCard
              description={`“${testimonial.comment}”`}
              index={index}
              key={`${testimonial.authorName ?? 'anonymous'}-${index}`}
              meta={testimonial.relationship}
              title={testimonial.isAnonymous || testimonial.authorName === null ? t('testimonials.anonymous') : testimonial.authorName}
            />
          ))}
        </PortfolioCarouselSection>

        <section className="portfolio-contact" id="contact" aria-labelledby="contact-title" data-analytics-section="contact">
          <p>{t('contact.eyebrow')}</p>
          <h2 id="contact-title">{t('contact.portfolioTitle')}</h2>
          <p className="portfolio-contact__intro">{t('contact.intro')}</p>
          <div className="portfolio-contact__links" aria-label={t('contact.linksLabel')}>
            <a href={appSettings.contact.githubUrl} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
            <a href={appSettings.contact.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
          </div>
          <p className="portfolio-contact__footer">This is me — {t('contact.footer')}</p>
        </section>
      </main>
    </div>
  </div>
}
