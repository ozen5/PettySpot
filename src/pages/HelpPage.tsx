import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header.tsx'
import { Illustration } from '../components/Illustration.tsx'
import { useAppSelector } from '../app/hooks.ts'
import { dictionary } from '../i18n/dictionary.ts'
import './HelpPage.scss'

type Animal = 'cat' | 'dog'

export function HelpPage() {
  const language = useAppSelector((state) => state.language.current)
  const messages = dictionary[language]
  const [animal, setAnimal] = useState<Animal | null>(null)
  const [checked, setChecked] = useState<boolean[]>(() =>
    messages.firstSteps.map(() => false),
  )
  const adviceTitle = animal === 'cat' ? messages.catAdviceTitle : messages.dogAdviceTitle
  const advice = animal === 'cat' ? messages.catAdvice : messages.dogAdvice
  const doneCount = checked.filter(Boolean).length
  const createTo = animal === null ? '/report/new' : `/report/new?animal=${animal}`

  function toggleStep(index: number) {
    setChecked((current) =>
      current.map((value, itemIndex) => (itemIndex === index ? !value : value)),
    )
  }

  return (
    <div className="help-page">
      <Header />
      <main className="help-page__main">
        <div className="help-page__intro-block">
          <div className="help-page__intro-text">
            <Link className="help-page__back" to="/">
              <span aria-hidden="true">←</span> {messages.helpBack}
            </Link>
            <h1 className="help-page__title">{messages.helpTitle}</h1>
            <p className="help-page__intro">{messages.helpIntro}</p>
          </div>
          <Illustration name="sadCat" className="help-page__illustration" />
        </div>

        <section className="help-page__choice" aria-labelledby="animal-choice">
          <h2 className="help-page__choice-title" id="animal-choice">
            {messages.animalPrompt}
          </h2>
          <div className="help-page__animals" role="group" aria-labelledby="animal-choice">
            {(['cat', 'dog'] as const).map((value) => (
              <button
                key={value}
                type="button"
                className={
                  animal === value
                    ? 'help-page__animal help-page__animal--current'
                    : 'help-page__animal'
                }
                aria-pressed={animal === value}
                onClick={() => setAnimal(value)}
              >
                <span className="help-page__animal-check" aria-hidden="true" />
                {value === 'cat' ? messages.cat : messages.dog}
              </button>
            ))}
          </div>
          {animal === null ? (
            <p className="help-page__hint">{messages.animalHint}</p>
          ) : null}
        </section>

        <div className="help-page__columns">
          <section className="help-page__steps" aria-labelledby="first-steps">
            <p className="help-page__eyebrow">{messages.helpGeneralLabel}</p>
            <div className="help-page__steps-head">
              <h2 className="help-page__section-title" id="first-steps">
                {messages.firstStepsTitle}
              </h2>
              <p className="help-page__progress" aria-live="polite">
                {messages.helpProgress
                  .replace('{done}', String(doneCount))
                  .replace('{total}', String(checked.length))}
              </p>
            </div>
            <ul className="help-page__list">
              {messages.firstSteps.map((step, index) => (
                <li
                  className={
                    checked[index] ? 'help-page__item help-page__item--done' : 'help-page__item'
                  }
                  key={step.title}
                >
                  <label className="help-page__label">
                    <input
                      className="help-page__check"
                      type="checkbox"
                      checked={checked[index] ?? false}
                      onChange={() => toggleStep(index)}
                    />
                    <span className="help-page__number" aria-hidden="true">
                      {index + 1}
                    </span>
                    <span>
                      <span className="help-page__item-title">{step.title}</span>
                      <span className="help-page__item-text">{step.text}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </section>

          <aside className="help-page__side">
            {animal !== null ? (
              <section className="help-page__advice" aria-labelledby="animal-advice">
                <p className="help-page__eyebrow help-page__eyebrow--on-dark">
                  {messages.helpAnimalLabel}
                </p>
                <h2 className="help-page__advice-title" id="animal-advice">
                  {adviceTitle}
                </h2>
                <ul className="help-page__advice-list">
                  {advice.map((item) => (
                    <li className="help-page__advice-item" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="help-page__create-block" aria-labelledby="help-create">
              <h2 className="help-page__create-title" id="help-create">
                {messages.helpCreateTitle}
              </h2>
              <p className="help-page__create-text">{messages.helpCreateText}</p>
              <Link className="button button--primary help-page__create" to={createTo}>
                {messages.report.create}
              </Link>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
