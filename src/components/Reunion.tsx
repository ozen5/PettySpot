import { Link } from 'react-router-dom'
import { useAppSelector } from '../app/hooks.ts'
import { dictionary } from '../i18n/dictionary.ts'
import { Illustration } from './Illustration.tsx'
import './Reunion.scss'

// Closing block of the home page: the goal of every search is getting home.
export function Reunion() {
  const language = useAppSelector((state) => state.language.current)
  const messages = dictionary[language]

  return (
    <section className="reunion" aria-labelledby="reunion-title">
      <div className="reunion__inner">
        <Illustration name="reunion" className="reunion__illustration" />
        <div className="reunion__content">
          <h2 className="reunion__title" id="reunion-title">
            {messages.reunionTitle}
          </h2>
          <p className="reunion__text">{messages.reunionText}</p>
          <Link className="button button--primary reunion__action" to="/report/new">
            {messages.reunionAction}
          </Link>
        </div>
      </div>
    </section>
  )
}
