import { useEffect, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import portfolio from './portfolio.json'
import './style.css'

type Project = {
  title: string
  category: string
  status?: string
  description: string
  tools: string[]
  url?: string
}
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

const sections = ['About', 'Projects', 'Experience', 'Skills', 'Contact']

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  function openInBrowser(event: MouseEvent<HTMLAnchorElement>) {
    if (window.runtime?.BrowserOpenURL) {
      event.preventDefault()
      window.runtime.BrowserOpenURL(href)
    }
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={openInBrowser}>
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
    <div className="layout">
      <a className="skip" href="#about">Skip to content</a>
      <aside className="sidebar">
        <a className="identity" href="#about">
          <span className="monogram" aria-hidden="true">NP</span>
          <span>{profile.name}</span>
        </a>
        <nav aria-label="Portfolio sections">
          {sections.map(section => (
            <a key={section} href={'#' + section.toLowerCase()}>{section}</a>
          ))}
        </nav>
        <div className="sidebar-links">
          <ExternalLink href={profile.github}>GitHub</ExternalLink>
          <ExternalLink href={profile.linkedin}>LinkedIn</ExternalLink>
        </div>
      </aside>

      <main>
        <section className="hero" id="about" aria-labelledby="intro-title">
          <p className="location">{profile.location}</p>
          <h1 id="intro-title">{profile.headline}</h1>
          <p className="intro">{profile.intro}</p>
          <div className="actions">
            <a className="primary" href="#projects">Explore my work <span aria-hidden="true">↓</span></a>
            <a href="#contact">Get in touch</a>
          </div>
        </section>

        <section id="projects" aria-labelledby="projects-title">
          <h2 id="projects-title">Selected projects</h2>
          <div className="project-grid">
            {projects.map(project => (
              <article className="project" key={project.title}>
                <p className="category">{project.category}{project.status && ' · ' + project.status}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <Tags items={project.tools} />
                {project.url && <ExternalLink href={project.url}>View source</ExternalLink>}
              </article>
            ))}
          </div>
        </section>

        <section id="experience" aria-labelledby="experience-title">
          <h2 id="experience-title">Experience</h2>
          <div className="experience">
            {profile.experience.map(job => (
              <article key={job.company}>
                <h3>{job.company}</h3>
                <div>
                  <p className="role">{job.role}</p>
                  <p>{job.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" aria-labelledby="skills-title">
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

        <section id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title">Get in touch</h2>
          <div className="actions">
            <ExternalLink href={profile.linkedin}>Message me on LinkedIn</ExternalLink>
            <ExternalLink href={profile.github}>Follow my work on GitHub</ExternalLink>
          </div>
        </section>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
