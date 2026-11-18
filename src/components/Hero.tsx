import { Link } from 'react-router-dom'
import { useAppSelector } from '../app/hooks.ts'
import { dictionary } from '../i18n/dictionary.ts'
import { Illustration } from './Illustration.tsx'
import './Hero.scss'

// Статичная иллюстрация интерфейса: не карта и не маршрут, только две разные отметки.
const exampleTimes = { lastSeen: '16.11 · 18:20', witness: '17.11 · 08:10' }

export function Hero() {
  const language = useAppSelector((state) => state.language.current)
  const messages = dictionary[language]

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__content">
        <p className="hero__eyebrow">{messages.heroEyebrow}</p>
        <h1 className="hero__title" id="hero-title">
          {messages.heroTitle}
        </h1>
        <p className="hero__text">{messages.heroText}</p>
        <div className="hero__actions">
          <Link className="button button--primary" to="/help">
            {messages.heroPrimary}
          </Link>
          <Link className="button button--secondary" to="/map">
            {messages.heroSecondary}
          </Link>
        </div>
      </div>

      <div className="hero__visual">
        <Illustration name="nightSearch" className="hero__illustration" priority />
        <figure className="hero__card" aria-labelledby="hero-card-title">
          <div className="hero__card-head">
            <p className="hero__card-title" id="hero-card-title">
              {messages.exampleTitle}
            </p>
            <span className="hero__chip">{messages.exampleLabel}</span>
          </div>
          <ul className="hero__marks">
            <li className="hero__mark hero__mark--origin">
              <span className="hero__shape hero__shape--place" aria-hidden="true" />
              <span className="hero__mark-body">
                <span className="hero__mark-title">{messages.lastSeen}</span>
                <span className="hero__mark-text">{messages.lastSeenNote}</span>
                <span className="hero__mark-meta">
                  <span className="hero__tag hero__tag--start">{messages.exampleStart}</span>
                  <span className="hero__time">
                    {messages.map.seenAt}: {exampleTimes.lastSeen}
                  </span>
                </span>
              </span>
            </li>
            <li className="hero__mark hero__mark--witness">
              <span className="hero__shape hero__shape--witness" aria-hidden="true" />
              <span className="hero__mark-body">
                <span className="hero__mark-title">{messages.witnessMark}</span>
                <span className="hero__mark-text">{messages.witnessMarkNote}</span>
                <span className="hero__mark-meta">
                  <span className="hero__tag hero__tag--unconfirmed">
                    {messages.map.unconfirmed}
                  </span>
                  <span className="hero__tag">{messages.exampleSeparate}</span>
                  <span className="hero__time">
                    {messages.map.seenAt}: {exampleTimes.witness}
                  </span>
                </span>
              </span>
            </li>
          </ul>
          <figcaption className="hero__card-note">{messages.exampleNote}</figcaption>
        </figure>
      </div>
    </section>
  )
}
