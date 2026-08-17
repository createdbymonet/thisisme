import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { appSettings, type SupportedLanguage } from '../../config/appSettings'
import experienceJson from '../../data/experience.json' with { type: 'json' }
import skillsJson from '../../data/skills.json' with { type: 'json' }
import type { Experience, Skill } from '../../data/types'
import { translate, type TranslationKey } from '../../i18n'
import { usePageAnalytics, useSectionAnalytics } from '../../analytics'

const navigation: Array<[TranslationKey, string]> = [['nav.skills', 'skills'], ['nav.experience', 'experience'], ['nav.projects', 'projects'], ['nav.about', 'about'], ['nav.testimonials', 'testimonials'], ['nav.contact', 'contact']]
const skills = skillsJson as Skill[]
const experience = experienceJson as Experience[]

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

function SkillList({ skills }: { skills: string[] }) {
  return <p className="skill-list">{skills.map((skill, index) => <span key={skill}>{skill}{index < skills.length - 1 && <i aria-hidden="true">•</i>}</span>)}</p>
}

export function HomePage() {
  usePageAnalytics('home')
  useSectionAnalytics('home')
  const [language, setLanguage] = useState<SupportedLanguage>(appSettings.application.defaultLanguage)
  const [testimonialState, setTestimonialState] = useState<TestimonialState>({ status: 'loading' })
  const t = (key: TranslationKey) => translate(language, key)
  const professionalSkills = skills.filter((skill) => skill.experienceType === 'professional').map((skill) => skill.name)
  const learningSkills = skills.filter((skill) => skill.experienceType === 'learning').map((skill) => skill.name)

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

  return <div className="home">
    <header className="site-header">
      <a className="site-header__brand" href="#top" aria-label={t('header.homeLabel')}>This is me</a>
      <nav className="site-header__nav" aria-label={t('header.mainNavigationLabel')}>{navigation.map(([key, id]) => <a href={`#${id}`} key={id}>{t(key)}</a>)}</nav>
      <div className="site-header__actions">
        <span className="language"><button type="button" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button><span aria-hidden="true">|</span><button type="button" aria-pressed={language === 'ja'} onClick={() => setLanguage('ja')}>日本語</button></span>
        <Link className="button button--small" to="/access">{t('nav.privateProfile')}</Link>
      </div>
    </header>

    <main id="top">
      <section className="hero" aria-labelledby="hero-title" data-analytics-section="hero">
        <div className="hero__copy">
          <p className="eyebrow">{t('hero.eyebrow')}</p>
          <h1 id="hero-title">{t('hero.title')}</h1>
          <p className="hero__stack">TypeScript • React • C# • {t('hero.webApplicationDevelopment')}</p>
          <p className="hero__summary">{t('hero.summary')}</p>
          <div className="button-row"><a className="button" href="#experience">{t('hero.viewExperience')}</a><a className="button" href="#projects">{t('hero.viewProjects')}</a></div>
        </div>
        <div className="visual-placeholder hero__visual">{t('hero.visualPlaceholder')}</div>
      </section>

      <section className="home-section home-section--blue" id="skills" aria-labelledby="skills-title" data-analytics-section="skills">
        <h2 id="skills-title">{t('skills.title')}</h2>
        <p className="section-intro">{t('skills.intro')}</p>
        <div className="card-grid card-grid--two">
          <article className="card card--paper"><h3>{t('skills.professional')}</h3><SkillList skills={professionalSkills} /></article>
          <article className="card card--warm"><h3>{t('skills.learning')}</h3><SkillList skills={learningSkills} /></article>
        </div>
      </section>

      <section className="home-section" id="experience" aria-labelledby="experience-title" data-analytics-section="experience">
        <h2 id="experience-title">{t('experience.title')}</h2>
        <p className="section-intro">{t('experience.intro')}</p>
        <div className="card-grid card-grid--four">{experience.map((item, index) => <article className={`card ${index % 2 === 0 ? 'card--blue' : 'card--warm'}`} key={item.id}><h3>{t(item.roleKey)}</h3><p>{t(item.summaryKey)}</p></article>)}</div>
        <p className="public-note">{t('experience.note')}</p>
      </section>

      <section className="home-section home-section--paper" id="projects" aria-labelledby="projects-title" data-analytics-section="projects">
        <h2 id="projects-title">{t('projects.title')}</h2>
        <p className="section-intro">{t('projects.intro')}</p>
        <div className="card-grid card-grid--two">
          <article className="card card--navy"><h3>This is me</h3><ul><li>React + TypeScript + Vite</li><li>Cloudflare Workers + D1</li><li>OpenAPI + Swagger UI</li><li>{t('projects.designedInFigma')}</li></ul></article>
          <article className="card card--warm"><h3>{t('projects.comingSoon')}</h3><p>{t('projects.comingSoonDescription')}</p></article>
        </div>
      </section>

      <section className="home-section home-section--blue" id="about" aria-labelledby="about-title" data-analytics-section="about">
        <h2 id="about-title">{t('about.title')}</h2>
        <div className="about-layout"><div className="about-copy"><h3>{t('about.careerTransition')}</h3><p>{t('about.description')}</p><p className="interests">{t('about.interests')}</p></div><div className="visual-placeholder about-layout__visual">{t('about.visualPlaceholder')}</div></div>
      </section>

      <section className="home-section home-section--paper" id="testimonials" aria-labelledby="testimonials-title" data-analytics-section="testimonials">
        <h2 id="testimonials-title">{t('testimonials.title')}</h2>
        <p className="section-intro">{t('testimonials.intro')}</p>
        {testimonialState.status === 'loading' && <p role="status">{t('testimonials.loading')}</p>}
        {testimonialState.status === 'failed' && <p role="alert">{t('testimonials.failure')}</p>}
        {testimonialState.status === 'ready' && testimonialState.testimonials.length === 0 && <p>{t('testimonials.empty')}</p>}
        {testimonialState.status === 'ready' && testimonialState.testimonials.length > 0 && <div className="card-grid card-grid--three">{testimonialState.testimonials.map((testimonial, index) => (
          <article className="card card--testimonial" key={`${testimonial.authorName ?? 'anonymous'}-${index}`}>
            <h3>“{testimonial.comment}”</h3>
            <p>— {testimonial.isAnonymous || testimonial.authorName === null ? t('testimonials.anonymous') : testimonial.authorName} / {testimonial.relationship}</p>
          </article>
        ))}</div>}
      </section>

      <section className="home-section contact" id="contact" aria-labelledby="contact-title" data-analytics-section="contact">
        <h2 id="contact-title">{t('contact.title')}</h2><p>{t('contact.intro')}</p>
        <div className="button-row" aria-label={t('contact.linksLabel')}><span className="button button--accent" aria-disabled="true">{t('contact.email')}</span><span className="button button--accent" aria-disabled="true">LinkedIn</span><a className="button button--accent" href={appSettings.contact.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a></div>
        <p className="contact__footer">This is me — {t('contact.footer')}</p>
      </section>
    </main>
  </div>
}
