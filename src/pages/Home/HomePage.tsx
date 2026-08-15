import { Link } from 'react-router-dom'

const navigation = [['Skills', 'skills'], ['Experience', 'experience'], ['Projects', 'projects'], ['About', 'about'], ['What People Say', 'testimonials'], ['Contact', 'contact']] as const
const professionalSkills = ['TypeScript', 'JavaScript', 'React', 'Vue.js', 'C#', 'REST API', 'Testing', 'Requirements Analysis', 'Git', 'GitHub', 'Debugging']
const learningSkills = ['Cloudflare Workers', 'Cloudflare D1', 'OpenAPI', 'Swagger UI', 'Vite', 'Serverless Architecture']
const experience = [
  { role: 'Veterinary Nurse', detail: 'Emergency / ICU / surgery' },
  { role: 'Software Developer', detail: 'Frontend → backend → testing' },
  { role: 'Volunteer Developer', detail: 'Canada / nonprofit development' },
  { role: 'Software Engineer', detail: 'Current direction' },
]

function SkillList({ skills }: { skills: string[] }) {
  return <p className="skill-list">{skills.map((skill, index) => <span key={skill}>{skill}{index < skills.length - 1 && <i aria-hidden="true">•</i>}</span>)}</p>
}

export function HomePage() {
  return <div className="home">
    <header className="site-header">
      <a className="site-header__brand" href="#top" aria-label="thisisme home">thisisme</a>
      <nav className="site-header__nav" aria-label="Main navigation">{navigation.map(([label, id]) => <a href={`#${id}`} key={id}>{label}</a>)}</nav>
      <div className="site-header__actions">
        <span className="language"><strong>EN</strong><span aria-hidden="true">|</span>日本語</span>
        <Link className="button button--small" to="/access">Private Profile</Link>
      </div>
    </header>

    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="eyebrow">SOFTWARE ENGINEER</p>
          <h1 id="hero-title">Hi, I build web applications.</h1>
          <p className="hero__stack">TypeScript • React • C# • Web Application Development</p>
          <p className="hero__summary">Frontend-focused software developer with experience expanding into backend development, testing, and requirements analysis.</p>
          <div className="button-row"><a className="button" href="#experience">View Experience</a><a className="button" href="#projects">View Projects</a></div>
        </div>
        <div className="visual-placeholder hero__visual">Photo / visual placeholder</div>
      </section>

      <section className="home-section home-section--blue" id="skills" aria-labelledby="skills-title">
        <h2 id="skills-title">Skills</h2>
        <p className="section-intro">Professional skills are separated from technologies learned while building this portfolio.</p>
        <div className="card-grid card-grid--two">
          <article className="card card--paper"><h3>Professional Skills</h3><SkillList skills={professionalSkills} /></article>
          <article className="card card--warm"><h3>Learning through thisisme</h3><SkillList skills={learningSkills} /></article>
        </div>
      </section>

      <section className="home-section" id="experience" aria-labelledby="experience-title">
        <h2 id="experience-title">Experience</h2>
        <p className="section-intro">A career journey from veterinary nursing to software engineering.</p>
        <div className="card-grid card-grid--four">{experience.map((item, index) => <article className={`card ${index % 2 === 0 ? 'card--blue' : 'card--warm'}`} key={item.role}><h3>{item.role}</h3><p>{item.detail}</p></article>)}</div>
        <p className="public-note">Public version: role, responsibilities, technologies, and approximate experience only. Company names remain protected.</p>
      </section>

      <section className="home-section home-section--paper" id="projects" aria-labelledby="projects-title">
        <h2 id="projects-title">Projects</h2>
        <p className="section-intro">More projects are coming soon. This portfolio itself is also one of my projects.</p>
        <div className="card-grid card-grid--two">
          <article className="card card--navy"><h3>thisisme</h3><ul><li>React + TypeScript + Vite</li><li>Cloudflare Workers + D1</li><li>OpenAPI + Swagger UI</li><li>Designed in Figma</li></ul></article>
          <article className="card card--warm"><h3>Coming Soon</h3><p>Additional projects will be added later.</p></article>
        </div>
      </section>

      <section className="home-section home-section--blue" id="about" aria-labelledby="about-title">
        <h2 id="about-title">About</h2>
        <div className="about-layout"><div className="about-copy"><h3>From veterinary medicine to software development</h3><p>A short story about the career transition, the values brought from veterinary nursing into software development, how new technologies are learned, and future career goals.</p><p className="interests">Basketball&nbsp; • &nbsp;Hiking&nbsp; • &nbsp;Cats</p></div><div className="visual-placeholder about-layout__visual">Personal visual / photo</div></div>
      </section>

      <section className="home-section home-section--paper" id="testimonials" aria-labelledby="testimonials-title">
        <h2 id="testimonials-title">What People Say</h2>
        <p className="section-intro">Approved comments from colleagues, managers, engineers, and volunteer teammates.</p>
        <div className="card-grid card-grid--three">{[1, 2, 3].map((number) => <article className="card card--testimonial" key={number}><h3>“Testimonial placeholder {number}”</h3><p>— Colleague / Teammate</p></article>)}</div>
      </section>

      <section className="home-section contact" id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">Contact</h2><p>For opportunities or collaboration, please reach out directly.</p>
        <div className="button-row" aria-label="Contact links"><span className="button button--accent" aria-disabled="true">Email</span><span className="button button--accent" aria-disabled="true">LinkedIn</span><span className="button button--accent" aria-disabled="true">GitHub</span></div>
        <p className="contact__footer">thisisme — portfolio wireframe</p>
      </section>
    </main>
  </div>
}
