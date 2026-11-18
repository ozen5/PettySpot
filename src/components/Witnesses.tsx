import { Link } from 'react-router-dom'
import { useAppSelector } from '../app/hooks.ts'
import { dictionary } from '../i18n/dictionary.ts'
import { Illustration } from './Illustration.tsx'
import './Witnesses.scss'

export function Witnesses() {
  const language = useAppSelector((state) => state.language.current)
  const messages = dictionary[language]

  return (
    <section className="witnesses" aria-labelledby="witnesses">
      <div className="witnesses__inner">
        <div className="witnesses__content">
          <p className="witnesses__eyebrow">{messages.witnessNav}</p>
          <h2 className="witnesses__heading" id="witnesses">
            {messages.witnessTitle}
          </h2>
          <p className="witnesses__text">{messages.witnessText}</p>
          <Link className="button button--on-dark witnesses__action" to="/map">
            {messages.witnessAction}
          </Link>
        </div>
        <div className="witnesses__aside">
          <Illustration name="witness" className="witnesses__illustration" />
          <div className="witnesses__panel">
            <ul className="witnesses__points">
              {messages.witnessPoints.map((point) => (
                <li className="witnesses__point" key={point}>
                  <span className="witnesses__point-mark" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <p className="witnesses__note">
              {messages.map.unconfirmed}. {messages.sighting.privacy}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
