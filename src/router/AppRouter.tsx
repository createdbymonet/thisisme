import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { getText } from '../content'
import { HomePage } from '../pages/Home/HomePage'

const DocsPage = lazy(() => import('../pages/Docs/DocsPage'))

export function AppRouter() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/docs" element={<Suspense fallback={<main>{getText('docs.loading')}</main>}><DocsPage /></Suspense>} />
  </Routes></BrowserRouter>
}
