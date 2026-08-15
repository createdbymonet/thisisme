import type { PropsWithChildren } from 'react'

type PageProps = PropsWithChildren<{ title: string }>

export function Page({ title, children }: PageProps) {
  return <main className="page"><h1>{title}</h1>{children}</main>
}
