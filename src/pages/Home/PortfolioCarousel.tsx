import { useLayoutEffect, useRef, type ReactNode } from 'react'
import type { ContentKey } from '../../content'

type PortfolioCarouselSectionProps = {
  children: ReactNode
  id: string
  t: (key: ContentKey) => string
  titleKey: ContentKey
  showScrollIndicator?: boolean
}

type PortfolioCardProps = {
  image?: ReactNode
  children?: ReactNode
  description?: string
  index: number
  meta?: string
  title: string
  technologies?: string[]
}

export function PortfolioCarouselSection({ children, id, t, titleKey, showScrollIndicator = false }: PortfolioCarouselSectionProps) {
  const titleId = `${id}-title`
  const carouselRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const carousel = carouselRef.current
    const indicator = indicatorRef.current
    const thumb = thumbRef.current
    if (!showScrollIndicator || !carousel || !indicator || !thumb) return
    const originalSnapStart = carousel.style.scrollPaddingInlineStart
    const originalSnapEnd = carousel.style.scrollPaddingInlineEnd

    let drag: { pointerId: number; startX: number; scrollLeft: number } | null = null
    const clearPointerFocus = () => { delete indicator.dataset.pointerFocus }
    const getSnapPositions = () => {
      const range = Math.max(0, carousel.scrollWidth - carousel.clientWidth)
      const first = carousel.children[0]?.getBoundingClientRect().left
      // Clamp unreachable starts to the endpoint so the final card remains visible.
      const starts = first === undefined ? [] : Array.from(carousel.children, (card) =>
        Math.max(0, Math.min(range, card.getBoundingClientRect().left - first)))
      return [...new Set([0, ...starts, range])].sort((a, b) => a - b)
    }
    const finishDrag = () => {
      if (!drag) return
      const pointerId = drag.pointerId
      drag = null
      delete carousel.dataset.scrollbarDragging
      delete indicator.dataset.dragging
      if (thumb.hasPointerCapture(pointerId)) thumb.releasePointerCapture(pointerId)
    }

    const updateIndicator = () => {
      const range = carousel.scrollWidth - carousel.clientWidth
      if (range <= 0) finishDrag()
      indicator.hidden = range <= 0
      indicator.tabIndex = range > 0 ? 0 : -1
      indicator.setAttribute('aria-disabled', String(range <= 0))
      const fraction = carousel.scrollWidth > 0 ? Math.min(1, carousel.clientWidth / carousel.scrollWidth) : 1
      const progress = range > 0 ? Math.max(0, Math.min(1, carousel.scrollLeft / range)) : 0
      thumb.style.width = `${fraction * 100}%`
      thumb.style.left = `${progress * (1 - fraction) * 100}%`
      indicator.setAttribute('aria-valuenow', String(Math.round(progress * 100)))
    }

    const startDrag = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0 || drag || carousel.scrollWidth <= carousel.clientWidth) return
      event.preventDefault()
      indicator.dataset.pointerFocus = 'true'
      indicator.focus({ preventScroll: true })
      drag = { pointerId: event.pointerId, startX: event.clientX, scrollLeft: carousel.scrollLeft }
      carousel.dataset.scrollbarDragging = 'true'
      indicator.dataset.dragging = 'true'
      thumb.setPointerCapture(event.pointerId)
    }
    const moveDrag = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.pointerId) return
      event.preventDefault()
      const travel = indicator.getBoundingClientRect().width - thumb.getBoundingClientRect().width
      const range = Math.max(0, carousel.scrollWidth - carousel.clientWidth)
      if (travel > 0) {
        carousel.scrollLeft = Math.max(0, Math.min(range, drag.scrollLeft + (event.clientX - drag.startX) * range / travel))
      }
      updateIndicator()
    }
    const endDrag = (event: PointerEvent) => {
      if (drag?.pointerId !== event.pointerId) return
      const positions = getSnapPositions()
      const nearest = positions.reduce((best, position) =>
        Math.abs(position - carousel.scrollLeft) < Math.abs(best - carousel.scrollLeft) ? position : best)
      // Position while snapping is disabled, then restore native snapping.
      carousel.scrollLeft = nearest
      finishDrag()
      updateIndicator()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      clearPointerFocus()
      const range = Math.max(0, carousel.scrollWidth - carousel.clientWidth)
      if (range === 0 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      finishDrag()
      const positions = getSnapPositions()
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? range
        : event.key === 'ArrowLeft'
          ? [...positions].reverse().find((position) => position < carousel.scrollLeft - 0.5) ?? 0
          : positions.find((position) => position > carousel.scrollLeft + 0.5) ?? range
      carousel.scrollLeft = Math.max(0, Math.min(range, next))
      updateIndicator()
    }

    const updateLayout = () => {
      // Scroll padding percentages use the scrollport, unlike layout padding.
      // Resolve the actual insets before paint and whenever the layout changes.
      const style = window.getComputedStyle(carousel)
      carousel.style.scrollPaddingInlineStart = style.paddingInlineStart
      carousel.style.scrollPaddingInlineEnd = style.paddingInlineEnd
      updateIndicator()
    }
    updateLayout()
    carousel.addEventListener('scroll', updateIndicator, { passive: true })
    thumb.addEventListener('pointerdown', startDrag)
    thumb.addEventListener('pointermove', moveDrag)
    thumb.addEventListener('pointerup', endDrag)
    thumb.addEventListener('pointercancel', endDrag)
    thumb.addEventListener('lostpointercapture', endDrag)
    indicator.addEventListener('keydown', handleKeyDown)
    indicator.addEventListener('blur', clearPointerFocus)
    window.addEventListener('resize', updateLayout)
    const observer = new ResizeObserver(updateLayout)
    observer.observe(carousel)
    for (const card of carousel.children) observer.observe(card)
    return () => {
      finishDrag()
      clearPointerFocus()
      carousel.removeEventListener('scroll', updateIndicator)
      thumb.removeEventListener('pointerdown', startDrag)
      thumb.removeEventListener('pointermove', moveDrag)
      thumb.removeEventListener('pointerup', endDrag)
      thumb.removeEventListener('pointercancel', endDrag)
      thumb.removeEventListener('lostpointercapture', endDrag)
      indicator.removeEventListener('keydown', handleKeyDown)
      indicator.removeEventListener('blur', clearPointerFocus)
      window.removeEventListener('resize', updateLayout)
      carousel.style.scrollPaddingInlineStart = originalSnapStart
      carousel.style.scrollPaddingInlineEnd = originalSnapEnd
      observer.disconnect()
    }
  }, [children, showScrollIndicator])

  return <section className="portfolio-section" id={id} aria-labelledby={titleId} data-analytics-section={id}>
    <div className="portfolio-section__heading">
      <h2 id={titleId}>{t(titleKey)}</h2>
    </div>
    <div className="portfolio-carousel-layout">
      <div id={`${id}-cards`} ref={carouselRef} className={`portfolio-carousel${showScrollIndicator ? ' portfolio-carousel--indicated' : ''}`} role="region" aria-label={`${t(titleKey)} — Horizontally scrollable cards`} tabIndex={0}>
        {children}
      </div>
      {showScrollIndicator && <div ref={indicatorRef} className="portfolio-carousel-indicator" role="scrollbar" aria-orientation="horizontal" aria-controls={`${id}-cards`} aria-labelledby={titleId} aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} aria-disabled="true" tabIndex={-1} hidden>
        <span ref={thumbRef} className="portfolio-carousel-indicator__thumb" aria-hidden="true" />
      </div>}
    </div>
  </section>
}

export function PortfolioCard({ children, description, image, index, meta, title, technologies }: PortfolioCardProps) {
  return <article className="portfolio-card" tabIndex={-1}>
    <div className="portfolio-card__topline">
      <span className="portfolio-card__number">{String(index + 1).padStart(2, '0')}</span>
      {meta && <span className="portfolio-card__meta">{meta}</span>}
    </div>
    {image}
    <h3>{title}</h3>
    {description && <p>{description}</p>}
    {!!technologies?.length && <ul className="portfolio-technology-list" aria-label={`${title} technologies`}>
      {technologies.map((technology) => <li key={technology}>{technology}</li>)}
    </ul>}
    {children}
  </article>
}
