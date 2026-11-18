import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { caseSaved } from '../cases/casesSlice.ts'
import { Header } from '../components/Header.tsx'
import { Illustration } from '../components/Illustration.tsx'
import { PhotoField } from '../components/PhotoField.tsx'
import { SearchMap } from '../components/SearchMap.tsx'
import { useAppDispatch, useAppSelector } from '../app/hooks.ts'
import { dictionary, type ReportErrors } from '../i18n/dictionary.ts'
import type { GeoPoint, LostPetCase } from '../map/types.ts'
import './ReportPage.scss'

type Animal = 'cat' | 'dog'

type Draft = {
  animal: Animal | ''
  name: string
  photoUrl: string
  description: string
  seenDate: string
  seenTime: string
  place: string
  point: GeoPoint | null
  phone: string
  email: string
}

type ErrorKey = keyof ReportErrors
type FieldErrors = Partial<Record<ErrorKey, true>>

// Same order as the form groups on screen: pet, last known place, time, contacts.
const fieldOrder = [
  'animal',
  'description',
  'place',
  'point',
  'date',
  'time',
  'future',
  'contact',
  'phone',
  'email',
] as const

function readAnimal(value: string | null): Animal | '' {
  return value === 'cat' || value === 'dog' ? value : ''
}

function emptyDraft(animal: Animal | ''): Draft {
  return {
    animal,
    name: '',
    photoUrl: '',
    description: '',
    seenDate: '',
    seenTime: '',
    place: '',
    point: null,
    phone: '',
    email: '',
  }
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function phoneDigits(value: string) {
  return value.replace(/\D/g, '')
}

function validate(draft: Draft): FieldErrors {
  const next: FieldErrors = {}

  if (draft.animal === '') next.animal = true
  if (draft.description.trim() === '') next.description = true
  if (draft.seenDate === '') next.date = true
  if (draft.seenTime === '') next.time = true
  if (draft.seenDate !== '' && draft.seenTime !== '') {
    const seen = new Date(`${draft.seenDate}T${draft.seenTime}`)
    if (Number.isNaN(seen.getTime()) || seen.getTime() > Date.now()) {
      next.future = true
    }
  }
  if (draft.place.trim() === '') next.place = true
  if (!draft.point) next.point = true

  const phone = draft.phone.trim()
  const email = draft.email.trim()
  if (phone === '' && email === '') {
    next.contact = true
  } else {
    if (phone !== '' && phoneDigits(phone).length < 10) next.phone = true
    if (email !== '' && !isEmail(email)) next.email = true
  }

  return next
}

function formatSeen(date: string, time: string) {
  const [year, month, day] = date.split('-')
  if (!year || !month || !day) return `${date} ${time}`
  return `${day}.${month}.${year}, ${time}`
}

function toLostPetCase(draft: Draft, id: string): LostPetCase {
  const text = (value: string) => ({ kk: value, ru: value })
  const animal = draft.animal === 'dog' ? 'dog' : 'cat'
  const point = draft.point ?? { latitude: 0, longitude: 0 }

  return {
    id,
    animal,
    source: 'session',
    title: text(draft.name.trim()),
    summary: text(draft.description.trim()),
    lastKnown: {
      point,
      seenAt: `${draft.seenDate}T${draft.seenTime}`,
      description: text(draft.place.trim()),
    },
    sightings: [],
  }
}

export function ReportPage() {
  const language = useAppSelector((state) => state.language.current)
  const messages = dictionary[language]
  const copy = messages.report
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const [caseId] = useState(() => `session-${crypto.randomUUID()}`)
  const [draft, setDraft] = useState(() =>
    emptyDraft(readAnimal(searchParams.get('animal'))),
  )
  const [errors, setErrors] = useState<FieldErrors>({})
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const photoUrlRef = useRef('')
  const pendingFocus = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current)
    }
  }, [])

  // After a successful submit, move focus to the preview heading so the saved state is announced.
  useEffect(() => {
    if (mode === 'preview') {
      document.getElementById('report-preview-title')?.focus({ preventScroll: true })
    }
  }, [mode])

  useEffect(() => {
    if (!pendingFocus.current) return
    document.getElementById(`report-${pendingFocus.current}`)?.focus()
    pendingFocus.current = null
  }, [errors])

  function updateDraft<Key extends keyof Draft>(key: Key, value: Draft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      const next = { ...current }
      if (key === 'animal') delete next.animal
      if (key === 'description') delete next.description
      if (key === 'seenDate' || key === 'seenTime') {
        delete next.date
        delete next.time
        delete next.future
      }
      if (key === 'place') delete next.place
      if (key === 'point') delete next.point
      if (key === 'phone' || key === 'email') {
        delete next.contact
        delete next.phone
        delete next.email
      }
      return next
    })
  }

  function setPhoto(file: File | null) {
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current)
    const url = file ? URL.createObjectURL(file) : ''
    photoUrlRef.current = url
    setDraft((current) => ({ ...current, photoUrl: url }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(draft)
    setErrors(nextErrors)
    const firstInvalid = fieldOrder.find((key) => nextErrors[key])
    if (firstInvalid) {
      pendingFocus.current = firstInvalid
      return
    }
    dispatch(caseSaved(toLostPetCase(draft, caseId)))
    setMode('preview')
    window.scrollTo({ top: 0 })
  }

  const animalName = draft.animal === 'cat' ? messages.cat : messages.dog
  const errorEntries = fieldOrder.flatMap((key) =>
    errors[key] ? [{ key, message: copy.errors[key] }] : [],
  )

  const required = (
    <span className="report-page__req">
      <span aria-hidden="true">*</span>
      <span className="report-page__visually-hidden"> ({copy.required})</span>
    </span>
  )
  const optional = <span className="report-page__optional">({copy.optional})</span>

  return (
    <div className="report-page">
      <Header />
      <main className="report-page__main">
        <Link className="report-page__back" to="/help">
          {copy.back}
        </Link>
        {mode === 'preview' ? (
          <section className="report-page__preview" aria-labelledby="report-preview-title">
            <p className="report-page__saved" role="status">
              <span className="report-page__saved-mark" aria-hidden="true">
                ✓
              </span>
              {copy.previewSaved}
            </p>
            <h1 className="report-page__title" id="report-preview-title" tabIndex={-1}>
              {copy.previewTitle}
            </h1>
            <div className="report-page__draft-note">
              <span className="report-page__badge">{copy.draftBadge}</span>
              <p>{copy.previewNote}</p>
              <p>{copy.sessionDraft}</p>
            </div>
            <article
              className={
                draft.photoUrl
                  ? 'report-page__card report-page__card--photo'
                  : 'report-page__card'
              }
            >
              {draft.photoUrl ? (
                <img
                  className="report-page__photo report-page__card-photo"
                  src={draft.photoUrl}
                  alt={copy.photoAlt}
                />
              ) : null}
              <div className="report-page__card-body">
                <p className="report-page__card-kind">{animalName}</p>
                <h2 className="report-page__card-title">
                  {draft.name.trim() || copy.noName}
                </h2>
                <p className="report-page__card-summary">{draft.description.trim()}</p>
                <dl className="report-page__facts">
                  <div>
                    <dt>
                      {copy.date}, {copy.time.toLowerCase()}
                    </dt>
                    <dd>{formatSeen(draft.seenDate, draft.seenTime)}</dd>
                  </div>
                  <div>
                    <dt>{copy.place}</dt>
                    <dd>{draft.place.trim()}</dd>
                  </div>
                  <div>
                    <dt>{copy.point}</dt>
                    <dd>{copy.pointChosen}</dd>
                  </div>
                  {draft.photoUrl ? null : (
                    <div>
                      <dt>{copy.photo}</dt>
                      <dd>{copy.noPhoto}</dd>
                    </div>
                  )}
                  {draft.phone.trim() ? (
                    <div>
                      <dt>{copy.phone}</dt>
                      <dd>{draft.phone.trim()}</dd>
                    </div>
                  ) : null}
                  {draft.email.trim() ? (
                    <div>
                      <dt>{copy.email}</dt>
                      <dd>{draft.email.trim()}</dd>
                    </div>
                  ) : null}
                </dl>
                <p className="report-page__card-private">{copy.contactPrivate}</p>
              </div>
            </article>
            <div className="report-page__actions">
              <Link
                className="report-page__button button button--primary"
                to={`/map?caseId=${caseId}`}
              >
                {copy.showOnMap}
              </Link>
              <button
                className="report-page__button button button--secondary"
                type="button"
                onClick={() => {
                  setMode('edit')
                  window.scrollTo({ top: 0 })
                }}
              >
                {copy.edit}
              </button>
            </div>
          </section>
        ) : (
          <>
            <div className="report-page__head report-page__head--illustrated">
              <div className="report-page__head-text">
                <span className="report-page__badge">{copy.draftBadge}</span>
                <h1 className="report-page__title">{copy.title}</h1>
                <p className="report-page__intro">{copy.intro}</p>
                <p className="report-page__required-note">{copy.requiredNote}</p>
              </div>
              <Illustration name="poster" className="report-page__head-illustration" />
            </div>
            {errorEntries.length > 0 ? (
              <div className="report-page__summary" role="alert">
                <p className="report-page__summary-title">{copy.errorsTitle}</p>
                <ul className="report-page__summary-list">
                  {errorEntries.map((entry) => (
                    <li key={entry.key}>
                      <button
                        className="report-page__error-jump"
                        type="button"
                        onClick={() =>
                          document.getElementById(`report-${entry.key}`)?.focus()
                        }
                      >
                        {entry.message}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <form className="report-page__form" noValidate onSubmit={handleSubmit}>
              <fieldset className="report-page__group">
                <legend className="report-page__group-title">
                  <span className="report-page__step" aria-hidden="true">
                    1
                  </span>
                  {copy.groupPet}
                </legend>

                <fieldset
                  className="report-page__field"
                  aria-describedby={errors.animal ? 'report-animal-error' : undefined}
                >
                  <legend className="report-page__label" id="report-animal-label">
                    {copy.animal} {required}
                  </legend>
                  <div className="report-page__choices">
                    <label
                      className={
                        draft.animal === 'cat'
                          ? 'report-page__choice report-page__choice--current'
                          : 'report-page__choice'
                      }
                    >
                      <input
                        id="report-animal"
                        type="radio"
                        name="animal"
                        value="cat"
                        checked={draft.animal === 'cat'}
                        aria-invalid={Boolean(errors.animal)}
                        onChange={() => updateDraft('animal', 'cat')}
                      />
                      {messages.cat}
                    </label>
                    <label
                      className={
                        draft.animal === 'dog'
                          ? 'report-page__choice report-page__choice--current'
                          : 'report-page__choice'
                      }
                    >
                      <input
                        type="radio"
                        name="animal"
                        value="dog"
                        checked={draft.animal === 'dog'}
                        aria-invalid={Boolean(errors.animal)}
                        onChange={() => updateDraft('animal', 'dog')}
                      />
                      {messages.dog}
                    </label>
                  </div>
                  {errors.animal ? (
                    <p className="report-page__error" id="report-animal-error">
                      {copy.errors.animal}
                    </p>
                  ) : null}
                </fieldset>

                <div className="report-page__field">
                  <label className="report-page__label" htmlFor="report-name">
                    {copy.name} {optional}
                  </label>
                  <input
                    id="report-name"
                    value={draft.name}
                    autoComplete="off"
                    onChange={(event) => updateDraft('name', event.target.value)}
                  />
                </div>

                <div className="report-page__field">
                  <label className="report-page__label" htmlFor="report-description">
                    {copy.description} {required}
                  </label>
                  <textarea
                    id="report-description"
                    value={draft.description}
                    aria-required="true"
                    aria-invalid={Boolean(errors.description)}
                    aria-describedby={
                      errors.description ? 'report-description-error' : undefined
                    }
                    onChange={(event) => updateDraft('description', event.target.value)}
                  />
                  {errors.description ? (
                    <p className="report-page__error" id="report-description-error">
                      {copy.errors.description}
                    </p>
                  ) : null}
                </div>

                <div className="report-page__field">
                  <PhotoField
                    id="report-photo"
                    label={
                      <>
                        {copy.photo} {optional}
                      </>
                    }
                    hint={copy.photoHint}
                    photoUrl={draft.photoUrl}
                    alt={copy.photoAlt}
                    chooseLabel={copy.photoChoose}
                    replaceLabel={copy.photoReplace}
                    removeLabel={copy.photoRemove}
                    onChange={setPhoto}
                  />
                </div>
              </fieldset>

              <fieldset className="report-page__group">
                <legend className="report-page__group-title">
                  <span className="report-page__step" aria-hidden="true">
                    2
                  </span>
                  {copy.groupPlace}
                </legend>

                <div className="report-page__field">
                  <label className="report-page__label" htmlFor="report-place">
                    {copy.place} {required}
                  </label>
                  <p className="report-page__hint" id="report-place-hint">
                    {copy.placeHint}
                  </p>
                  <input
                    id="report-place"
                    value={draft.place}
                    autoComplete="off"
                    aria-required="true"
                    aria-invalid={Boolean(errors.place)}
                    aria-describedby={
                      errors.place ? 'report-place-hint report-place-error' : 'report-place-hint'
                    }
                    onChange={(event) => updateDraft('place', event.target.value)}
                  />
                  {errors.place ? (
                    <p className="report-page__error" id="report-place-error">
                      {copy.errors.place}
                    </p>
                  ) : null}
                </div>

                <div
                  className={
                    errors.point
                      ? 'report-page__field report-page__map report-page__map--invalid'
                      : 'report-page__field report-page__map'
                  }
                >
                  <p className="report-page__label" id="report-point-label">
                    {copy.point} {required}
                  </p>
                  <p className="report-page__hint" id="report-point-hint">
                    {copy.pointHint}
                  </p>
                  <SearchMap
                    markers={[]}
                    selectedCaseId={null}
                    focus={null}
                    selection={draft.point}
                    onPickPoint={(point) => updateDraft('point', point)}
                    onSelectCase={() => undefined}
                    labels={{
                      lastKnown: copy.point,
                      sampleReport: copy.point,
                      seenAt: copy.time,
                      pickedPoint: copy.pointChosen,
                    }}
                  />
                  {draft.point ? (
                    <p className="report-page__chosen" role="status">
                      <span aria-hidden="true">✓ </span>
                      {copy.pointChosen}
                    </p>
                  ) : null}
                  {errors.point ? (
                    <p className="report-page__error" id="report-point" tabIndex={-1}>
                      {copy.errors.point}
                    </p>
                  ) : null}
                </div>
              </fieldset>

              <fieldset className="report-page__group">
                <legend className="report-page__group-title">
                  <span className="report-page__step" aria-hidden="true">
                    3
                  </span>
                  {copy.groupTime}
                </legend>
                <div className="report-page__when">
                  <div className="report-page__field">
                    <label className="report-page__label" htmlFor="report-date">
                      {copy.date} {required}
                    </label>
                    <input
                      id="report-date"
                      type="date"
                      value={draft.seenDate}
                      aria-required="true"
                      aria-invalid={Boolean(errors.date || errors.future)}
                      aria-describedby={
                        errors.date
                          ? 'report-date-error'
                          : errors.future
                            ? 'report-future'
                            : undefined
                      }
                      onChange={(event) => updateDraft('seenDate', event.target.value)}
                    />
                    {errors.date ? (
                      <p className="report-page__error" id="report-date-error">
                        {copy.errors.date}
                      </p>
                    ) : null}
                  </div>
                  <div className="report-page__field">
                    <label className="report-page__label" htmlFor="report-time">
                      {copy.time} {required}
                    </label>
                    <input
                      id="report-time"
                      type="time"
                      value={draft.seenTime}
                      aria-required="true"
                      aria-invalid={Boolean(errors.time || errors.future)}
                      aria-describedby={
                        errors.time
                          ? 'report-time-error'
                          : errors.future
                            ? 'report-future'
                            : undefined
                      }
                      onChange={(event) => updateDraft('seenTime', event.target.value)}
                    />
                    {errors.time ? (
                      <p className="report-page__error" id="report-time-error">
                        {copy.errors.time}
                      </p>
                    ) : null}
                  </div>
                </div>
                {errors.future ? (
                  <p className="report-page__error" id="report-future" tabIndex={-1}>
                    {copy.errors.future}
                  </p>
                ) : null}
              </fieldset>

              <fieldset
                className="report-page__group"
                aria-describedby="report-contact-hint"
              >
                <legend className="report-page__group-title">
                  <span className="report-page__step" aria-hidden="true">
                    4
                  </span>
                  {copy.contact} {required}
                </legend>
                <p className="report-page__hint" id="report-contact-hint">
                  {copy.contactHint} {copy.contactPrivate}
                </p>
                <div className="report-page__contacts">
                  <div className="report-page__field">
                    <label className="report-page__label" htmlFor="report-phone">
                      {copy.phone}
                    </label>
                    <input
                      id="report-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={draft.phone}
                      aria-invalid={Boolean(errors.phone || errors.contact)}
                      aria-describedby={
                        errors.phone || errors.contact ? 'report-contact-error' : undefined
                      }
                      onChange={(event) => updateDraft('phone', event.target.value)}
                    />
                  </div>
                  <div className="report-page__field">
                    <label className="report-page__label" htmlFor="report-email">
                      {copy.email}
                    </label>
                    <input
                      id="report-email"
                      type="email"
                      autoComplete="email"
                      value={draft.email}
                      aria-invalid={Boolean(errors.email || errors.contact)}
                      aria-describedby={
                        errors.email || errors.contact ? 'report-contact-error' : undefined
                      }
                      onChange={(event) => updateDraft('email', event.target.value)}
                    />
                  </div>
                </div>
                {errors.contact || errors.phone || errors.email ? (
                  <div className="report-page__error" id="report-contact-error">
                    {errors.contact ? (
                      <p id="report-contact" tabIndex={-1}>
                        {copy.errors.contact}
                      </p>
                    ) : null}
                    {errors.phone ? <p>{copy.errors.phone}</p> : null}
                    {errors.email ? <p>{copy.errors.email}</p> : null}
                  </div>
                ) : null}
              </fieldset>

              <div className="report-page__submit">
                <p className="report-page__submit-note" id="report-submit-note">
                  <span className="report-page__badge">{copy.draftBadge}</span>
                  {copy.submitHint}
                </p>
                <button
                  className="report-page__button button button--primary"
                  type="submit"
                  aria-describedby="report-submit-note"
                >
                  {copy.submit}
                </button>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  )
}
