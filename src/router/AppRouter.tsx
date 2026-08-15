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

export function AppRouter() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/recommend" element={<RecommendPage />} />
    <Route path="/access" element={<AccessPage />} />
    <Route path="/private" element={<PrivateProfilePage />} />
    <Route path="/manage-portal" element={<AdminLoginPage />} />
    <Route path="/admin" element={<DashboardPage />} />
    <Route path="/admin/access-codes" element={<AccessCodesPage />} />
    <Route path="/admin/analytics" element={<AnalyticsPage />} />
    <Route path="/admin/testimonials" element={<TestimonialsPage />} />
    <Route path="/admin/settings" element={<SettingsPage />} />
  </Routes></BrowserRouter>
}
