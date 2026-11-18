import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { LanguageSwitcher } from './LanguageSwitcher.tsx'
import { useAppSelector } from '../app/hooks.ts'
import { dictionary } from '../i18n/dictionary.ts'
import './Header.scss'

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? 'header__link header__link--current' : 'header__link'
}

export function Header() {
  const language = useAppSelector((state) => state.language.current)
  const messages = dictionary[language]
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuLocation, setMenuLocation] = useState(location)
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const navId = useId()

  // Меню закрывается при любом переходе (в том числе по якорю на главной).
  if (menuLocation !== location) {
    setMenuLocation(location)
    if (menuOpen) setMenuOpen(false)
  }

  useEffect(() => {
    if (!menuOpen) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      className={menuOpen ? 'header header--menu-open' : 'header'}
      id="top"
      ref={headerRef}
    >
      <div className="header__inner">
        <Link className="header__brand" to="/#top" onClick={closeMenu}>
          <span className="header__brand-mark" aria-hidden="true" />
          {messages.brand}
        </Link>
        <nav
          className={menuOpen ? 'header__nav header__nav--open' : 'header__nav'}
          id={navId}
          aria-label={messages.navigation}
        >
          <Link className="header__link" to="/#how-it-works" onClick={closeMenu}>
            {messages.howItWorks}
          </Link>
          <Link className="header__link" to="/#witnesses" onClick={closeMenu}>
            {messages.witnessNav}
          </Link>
          <NavLink className={navLinkClass} to="/help" onClick={closeMenu}>
            {messages.helpNav}
          </NavLink>
          <NavLink className={navLinkClass} to="/map" onClick={closeMenu}>
            {messages.map.nav}
          </NavLink>
        </nav>
        <div className="header__tools">
          <LanguageSwitcher />
          <button
            ref={toggleRef}
            type="button"
            className="header__menu-toggle"
            aria-expanded={menuOpen}
            aria-controls={navId}
            aria-label={menuOpen ? messages.menuClose : messages.menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="header__menu-icon" aria-hidden="true" />
            <span className="header__menu-text">{messages.menu}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
