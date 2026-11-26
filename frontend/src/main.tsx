import { useEffect, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import portfolio from './portfolio.json'
import './style.css'

type Project = typeof portfolio.projects[number]
type Profile = Omit<typeof portfolio, 'projects'>

declare global {
  interface Window {
    go?: { main?: { App?: {
      GetProfile(): Promise<Profile>
      GetProjects(): Promise<Project[]>
    } } }
    runtime?: { BrowserOpenURL(url: string): void }
  }
}

const navigation = [
  ['Projects', 'projects'], ['Experience', 'experience'],
  ['Skills', 'skills'], ['Education', 'education'], ['Contact', 'contact'],
]

function ExternalLink({ href, children, className }: {
  href: string
  children: ReactNode
  className?: string
}) {
  function openInBrowser(event: MouseEvent<HTMLAnchorElement>) {
    if (window.runtime?.BrowserOpenURL) {
      event.preventDefault()
      window.runtime.BrowserOpenURL(href)
    }
  }

  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer" onClick={openInBrowser}>
      {children} <span aria-hidden="true">↗</span>
    </a>
  )
}

function Tags({ items }: { items: string[] }) {
  return <ul className="tags">{items.map(item => <li key={item}>{item}</li>)}</ul>
}

function App() {
  const [profile, setProfile] = useState<Profile>(portfolio)
  const [projects, setProjects] = useState<Project[]>(portfolio.projects)

  useEffect(() => {
    const backend = window.go?.main?.App
    if (backend) {
      Promise.all([backend.GetProfile(), backend.GetProjects()])
        .then(([nextProfile, nextProjects]) => {
          setProfile(nextProfile)
          setProjects(nextProjects)
        })
        .catch(error => console.error('Could not load the desktop portfolio data.', error))
    }
  }, [])

  return (
    <>
      <a className="skip" href="#about">Skip to content</a>
      <header className="site-header">
        <div className="shell header-inner">
          <a className="identity" href="#about">
            <span className="monogram" aria-hidden="true">NP</span>{profile.name}
          </a>
          <nav aria-label="Portfolio sections">
            {navigation.map(([label, id]) => <a key={id} href={'#' + id}>{label}</a>)}
          </nav>
        </div>
      </header>

      <main className="shell">
        <section className="hero" id="about" aria-labelledby="intro-title" tabIndex={-1}>
          <div className="hero-copy">
            <p className="eyebrow"><span className="dot" />{profile.location}</p>
            <h1 id="intro-title">{profile.headline}</h1>
            <p className="intro">{profile.intro}</p>
            <div className="actions">
              <a className="button primary" href="#projects">Explore my work <span aria-hidden="true">↓</span></a>
              <ExternalLink className="button secondary" href={profile.linkedin}>LinkedIn</ExternalLink>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-outer" />
            <div className="orbit orbit-inner" />
            <span className="art-monogram">NP</span>
          </div>
        </section>

        <section className="section" id="projects" aria-labelledby="projects-title">
          <h2 id="projects-title">Featured projects</h2>
          <div className="project-grid">
            {projects.map(project => (
              <article className="project" key={project.title}>
                <p className="eyebrow">{project.category}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <dl className="metrics">
                  {project.metrics.map(metric => (
                    <div key={metric.label}>
                      <dt>{metric.label}</dt>
                      <dd>{metric.value}</dd>
                    </div>
                  ))}
                </dl>
                <details>
                  <summary>Methods and results</summary>
                  <ul className="project-details">{project.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
                </details>
                <Tags items={project.tools} />
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="experience" aria-labelledby="experience-title">
          <h2 id="experience-title">Experience</h2>
          <div className="experience">
            {profile.experience.map(job => (
              <article key={job.company}>
                <div>
                  <h3>{job.company}</h3>
                  <p className="period">{job.period}</p>
                </div>
                <div>
                  <p className="role">{job.role}</p>
                  <p>{job.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="skills" aria-labelledby="skills-title">
          <h2 id="skills-title">Technical skills</h2>
          <div className="skill-grid">
            {profile.skills.map(group => (
              <article key={group.area}>
                <h3>{group.area}</h3>
                <Tags items={group.tools} />
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="education" aria-labelledby="education-title">
          <h2 id="education-title">Education</h2>
          <div className="education-grid">
            {profile.education.map(entry => (
              <article key={entry.degree}>
                <h3>{entry.degree}</h3>
                <p>{entry.institution}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section contact" id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title">Get in touch</h2>
          <div className="actions">
            <ExternalLink className="button primary" href={profile.linkedin}>Message me on LinkedIn</ExternalLink>
            <ExternalLink className="button secondary" href={profile.github}>GitHub profile</ExternalLink>
          </div>
        </section>
      </main>
    </>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
