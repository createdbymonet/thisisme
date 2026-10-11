import { useId, useState } from 'react'
import type { ContentKey } from '../../content'

type NavigationItem = {
  id: string
  labelKey: ContentKey
}

type PortfolioHeaderProps = {
  navigation: NavigationItem[]
  t: (key: ContentKey) => string
}

export function PortfolioHeader({ navigation, t }: PortfolioHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuId = useId()

  return <header className="portfolio-header">
    <nav className="portfolio-header__desktop-nav" aria-label="Main navigation">
      {navigation.map(({ id, labelKey }) => <a href={`#${id}`} key={id}>{t(labelKey)}</a>)}
    </nav>

    <button
      className="portfolio-header__menu-button"
      type="button"
      aria-controls={isMenuOpen ? menuId : undefined}
      aria-expanded={isMenuOpen}
      onClick={() => setIsMenuOpen((open) => !open)}
    >
      {isMenuOpen ? t('nav.close') : t('nav.menu')}
    </button>

    {isMenuOpen && <nav className="portfolio-header__mobile-nav" id={menuId} aria-label="Main navigation">
      {navigation.map(({ id, labelKey }) => <a href={`#${id}`} key={id} onClick={() => setIsMenuOpen(false)}>{t(labelKey)}</a>)}
    </nav>}
  </header>
}
