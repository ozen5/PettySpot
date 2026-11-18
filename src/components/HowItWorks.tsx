import { useAppSelector } from '../app/hooks.ts'
import { dictionary } from '../i18n/dictionary.ts'
import { Illustration } from './Illustration.tsx'
import './HowItWorks.scss'

export function HowItWorks() {
  const language = useAppSelector((state) => state.language.current)
  const messages = dictionary[language]

  return (
    <section className="how-it-works" aria-labelledby="how-it-works">
      <div className="how-it-works__inner">
        <div className="how-it-works__intro">
          <h2 className="how-it-works__heading" id="how-it-works">
            {messages.howItWorks}
          </h2>
          <p className="how-it-works__lead">{messages.stepsIntro}</p>
          <Illustration name="pawTrail" className="how-it-works__banner" />
        </div>
        <ol className="how-it-works__list">
          {messages.steps.map((step, index) => (
            <li className="how-it-works__step" key={step.title}>
              <p className="how-it-works__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </p>
              <div>
                <h3 className="how-it-works__step-title">{step.title}</h3>
                <p className="how-it-works__step-text">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
