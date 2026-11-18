import { useAppSelector } from '../app/hooks.ts'
import { dictionary } from '../i18n/dictionary.ts'
import { contactPhoneDisplay, contactPhoneTel } from './contacts.ts'
import './Footer.scss'

export function Footer() {
  const language = useAppSelector((state) => state.language.current)
  const messages = dictionary[language]

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__name">{messages.brand}</p>
          <p className="site-footer__tagline">{messages.footer.tagline}</p>
        </div>
        <div className="site-footer__contact">
          <h2 className="site-footer__contact-title">{messages.footer.contactTitle}</h2>
          <a className="site-footer__phone" href={contactPhoneTel}>
            {contactPhoneDisplay}
          </a>
        </div>
      </div>
    </footer>
  )
}
