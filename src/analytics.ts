import { useEffect } from 'react'

export type AnalyticsPageKey = 'home' | 'recommend' | 'access' | 'private'
export type AnalyticsSectionKey = 'hero' | 'skills' | 'experience' | 'projects' | 'about' | 'testimonials' | 'contact' | 'protected-profile'

let currentPage: AnalyticsPageKey | null = null

function send(body: object, beacon = false) {
  const payload = JSON.stringify(body)
  if (beacon && navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/events', payload)
    return
  }
  void fetch('/api/analytics/events', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: payload }).catch(() => undefined)
}

export function usePageAnalytics(pageKey: AnalyticsPageKey) {
  useEffect(() => {
    if (currentPage !== pageKey) {
      currentPage = pageKey
      send({ eventType: 'page_view', pageKey })
    }

    let activeSince = document.visibilityState === 'visible' ? Date.now() : null
    let accumulated = 0
    const flush = (beacon = false) => {
      if (activeSince !== null) { accumulated += Date.now() - activeSince; activeSince = Date.now() }
      const durationMs = Math.min(Math.round(accumulated), 300_000)
      if (durationMs >= 1_000) { send({ eventType: 'engagement', pageKey, durationMs }, beacon); accumulated = 0 }
    }
    const visibility = () => {
      if (document.visibilityState === 'hidden') { flush(true); activeSince = null }
      else if (activeSince === null) activeSince = Date.now()
    }
    const interval = window.setInterval(() => flush(), 30_000)
    document.addEventListener('visibilitychange', visibility)
    return () => { window.clearInterval(interval); document.removeEventListener('visibilitychange', visibility); flush(true) }
  }, [pageKey])
}

export function useSectionAnalytics(pageKey: AnalyticsPageKey) {
  useEffect(() => {
    const viewed = new Set<string>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const sectionKey = (entry.target as HTMLElement).dataset.analyticsSection as AnalyticsSectionKey | undefined
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && sectionKey && !viewed.has(sectionKey)) {
          viewed.add(sectionKey)
          send({ eventType: 'section_view', pageKey, sectionKey })
          observer.unobserve(entry.target)
        }
      }
    }, { threshold: 0.5 })
    document.querySelectorAll('[data-analytics-section]').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [pageKey])
}
