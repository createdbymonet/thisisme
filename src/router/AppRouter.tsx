import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AccessPage } from '../pages/Access/AccessPage'
import { HomePage } from '../pages/Home/HomePage'
import { PrivateProfilePage } from '../pages/PrivateProfile/PrivateProfilePage'
import { RecommendPage } from '../pages/Recommend/RecommendPage'
import { AccessCodesPage } from '../pages/admin/AccessCodes/AccessCodesPage'
import { AdminLoginPage } from '../pages/admin/AdminLogin/AdminLoginPage'
import { AnalyticsPage } from '../pages/admin/Analytics/AnalyticsPage'
import { DashboardPage } from '../pages/admin/Dashboard/DashboardPage'
import { SettingsPage } from '../pages/admin/Settings/SettingsPage'
import { TestimonialsPage } from '../pages/admin/Testimonials/TestimonialsPage'
import { AdminRoute } from '../components/admin/AdminRoute'

const DocsPage = lazy(() => import('../pages/Docs/DocsPage'))

export function AppRouter() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/recommend" element={<RecommendPage />} />
    <Route path="/access" element={<AccessPage />} />
    <Route path="/docs" element={<Suspense fallback={<main>Loading documentation…</main>}><DocsPage /></Suspense>} />
    <Route path="/private" element={<PrivateProfilePage />} />
    <Route path="/manage-portal" element={<AdminLoginPage />} />
    <Route path="/admin" element={<AdminRoute><DashboardPage /></AdminRoute>} />
    <Route path="/admin/access-codes" element={<AdminRoute><AccessCodesPage /></AdminRoute>} />
    <Route path="/admin/analytics" element={<AdminRoute><AnalyticsPage /></AdminRoute>} />
    <Route path="/admin/testimonials" element={<AdminRoute><TestimonialsPage /></AdminRoute>} />
    <Route path="/admin/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />
  </Routes></BrowserRouter>
}
