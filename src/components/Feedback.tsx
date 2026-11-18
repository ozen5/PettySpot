import { useId, useRef, useState, type FormEvent } from 'react'
import { useAppSelector } from '../app/hooks.ts'
import { dictionary } from '../i18n/dictionary.ts'
import { buildWhatsAppUrl } from './contacts.ts'
import './Feedback.scss'

const nameMaxLength = 80
const messageMaxLength = 1000

// Feedback form without a backend: it only prepares a WhatsApp message.
// Nothing is stored on the site (no Redux, no localStorage/sessionStorage).
export function Feedback() {
  const language = useAppSelector((state) => state.language.current)
  const copy = dictionary[language].feedback
  const id = useId()
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [showError, setShowError] = useState(false)
  const [openedUrl, setOpenedUrl] = useState<string | null>(null)

  const ids = {
    title: `${id}-title`,
    hint: `${id}-hint`,
    name: `${id}-name`,
    message: `${id}-message`,
    messageHint: `${id}-message-hint`,
    counter: `${id}-counter`,
    error: `${id}-error`,
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = message.trim()

    if (!text) {
      setShowError(true)
      setOpenedUrl(null)
      messageRef.current?.focus()
      return
    }

    const lines = [copy.messageIntro]
    const trimmedName = name.trim()
    if (trimmedName) lines.push(`${copy.messageName}: ${trimmedName}`)
    lines.push('', text)

    const url = buildWhatsAppUrl(lines.join('\n'))
    window.open(url, '_blank', 'noopener,noreferrer')
    setOpenedUrl(url)
  }

  return (
    <section className="feedback" id="feedback" aria-labelledby={ids.title}>
      <div className="feedback__inner">
        <div className="feedback__intro">
          <h2 className="feedback__title" id={ids.title}>
            {copy.title}
          </h2>
          <p className="feedback__text">{copy.text}</p>
        </div>

        <form className="feedback__form" noValidate onSubmit={handleSubmit}>
          <div className="feedback__field">
            <label className="feedback__label" htmlFor={ids.name}>
              {copy.nameLabel} <span className="feedback__optional">({copy.optional})</span>
            </label>
            <input
              id={ids.name}
              className="feedback__input"
              type="text"
              autoComplete="name"
              maxLength={nameMaxLength}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="feedback__field">
            <label className="feedback__label" htmlFor={ids.message}>
              {copy.messageLabel} <span className="feedback__optional">({copy.required})</span>
            </label>
            <p className="feedback__field-hint" id={ids.messageHint}>
              {copy.messageHint}
            </p>
            <textarea
              ref={messageRef}
              id={ids.message}
              className="feedback__input feedback__textarea"
              required
              maxLength={messageMaxLength}
              value={message}
              aria-invalid={showError}
              aria-describedby={[showError ? ids.error : '', ids.messageHint, ids.counter]
                .filter(Boolean)
                .join(' ')}
              onChange={(event) => {
                setMessage(event.target.value)
                if (showError && event.target.value.trim()) setShowError(false)
              }}
            />
            <div className="feedback__meta">
              {showError ? (
                <p className="feedback__error" id={ids.error}>
                  {copy.emptyError}
                </p>
              ) : null}
              <p className="feedback__counter" id={ids.counter}>
                {message.length}/{messageMaxLength}
              </p>
            </div>
          </div>

          <p className="feedback__hint" id={ids.hint}>
            {copy.whatsappHint}
          </p>

          <button className="button button--primary feedback__submit" type="submit" aria-describedby={ids.hint}>
            {copy.submit}
          </button>

          <div className="feedback__status" role="status">
            {openedUrl ? (
              <p className="feedback__opened">
                {copy.opened}{' '}
                <a href={openedUrl} target="_blank" rel="noopener noreferrer">
                  {copy.openAgain}
                </a>
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  )
}
