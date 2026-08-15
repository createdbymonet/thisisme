import type { PropsWithChildren } from 'react'

type StandalonePageProps = PropsWithChildren<{
  className: string
  route: string
  title: string
  intro: string
}>

export function StandalonePage({ className, route, title, intro, children }: StandalonePageProps) {
  return (
    <main className={`standalone-page ${className}`}>
      <header className="standalone-page__header">
        <p className="standalone-page__route">{route}</p>
        <h1>{title}</h1>
        <p className="standalone-page__intro">{intro}</p>
      </header>
      {children}
    </main>
  )
}
