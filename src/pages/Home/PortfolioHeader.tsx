import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import type { SupportedLanguage } from '../../config/appSettings'
import type { TranslationKey } from '../../i18n'

type NavigationItem = {
  id: string
  labelKey: TranslationKey
}

type PortfolioHeaderProps = {
  language: SupportedLanguage
  navigation: NavigationItem[]
  onLanguageChange: (language: SupportedLanguage) => void
  t: (key: TranslationKey) => string
}

function LanguageSwitch({ language, onLanguageChange, t }: Pick<PortfolioHeaderProps, 'language' | 'onLanguageChange' | 't'>) {
  return <div className="portfolio-language" aria-label={t('header.languageLabel')}>
    <button type="button" aria-pressed={language === 'en'} onClick={() => onLanguageChange('en')}>EN</button>
    <span aria-hidden="true">/</span>
    <button type="button" aria-pressed={language === 'ja'} onClick={() => onLanguageChange('ja')}>日本語</button>
  </div>
}

export function PortfolioHeader({ language, navigation, onLanguageChange, t }: PortfolioHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuId = useId()

  return <header className="portfolio-header">
    <a className="portfolio-header__brand" href="#top" aria-label={t('header.homeLabel')}>MOE</a>

    <nav className="portfolio-header__desktop-nav" aria-label={t('header.mainNavigationLabel')}>
      {navigation.map(({ id, labelKey }) => <a href={`#${id}`} key={id}>{t(labelKey)}</a>)}
      <LanguageSwitch language={language} onLanguageChange={onLanguageChange} t={t} />
      <Link className="portfolio-header__private" to="/access">{t('nav.privateProfile')}</Link>
    </nav>

    <button
      className="portfolio-header__menu-button"
      type="button"
      aria-controls={menuId}
      aria-expanded={isMenuOpen}
      onClick={() => setIsMenuOpen((open) => !open)}
    >
      {isMenuOpen ? t('nav.close') : t('nav.menu')}
    </button>

    {isMenuOpen && <nav className="portfolio-header__mobile-nav" id={menuId} aria-label={t('header.mainNavigationLabel')}>
      {navigation.map(({ id, labelKey }) => <a href={`#${id}`} key={id} onClick={() => setIsMenuOpen(false)}>{t(labelKey)}</a>)}
      <Link to="/access" onClick={() => setIsMenuOpen(false)}>{t('nav.privateProfile')}</Link>
      <LanguageSwitch language={language} onLanguageChange={onLanguageChange} t={t} />
    </nav>}
  </header>
}
