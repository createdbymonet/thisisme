import { Page } from '../../components/Page'

const sections = ['Hero', 'Skills', 'Experience', 'Projects', 'About', 'What People Say', 'Contact']

export function HomePage() {
  return <Page title="Home">{sections.map((section) => <section key={section}><h2>{section}</h2></section>)}</Page>
}
