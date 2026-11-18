import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { sightingReported } from '../cases/casesSlice.ts'
import { Header } from '../components/Header.tsx'
import { Illustration } from '../components/Illustration.tsx'
import { PhotoField } from '../components/PhotoField.tsx'
import { SearchMap, type SearchMapMarker } from '../components/SearchMap.tsx'
import { useAppDispatch, useAppSelector } from '../app/hooks.ts'
import { dictionary, type SightingErrors } from '../i18n/dictionary.ts'
import { getLostPetCases } from '../map/getLostPetCases.ts'
import type { GeoPoint } from '../map/types.ts'
import './ReportPage.scss'
import './SightingPage.scss'

type SightingDraft = {
  point: GeoPoint | null
  seenDate: string
  seenTime: string
  description: string
  photoUrl: string
}

type ErrorKey = keyof SightingErrors
type FieldErrors = Partial<Record<ErrorKey, true>>

const fieldOrder = ['point', 'date', 'time', 'future'] as const

const descriptionMaxLength = 280

function validate(draft: SightingDraft): FieldErrors {
  const next: FieldErrors = {}
  if (!draft.point) next.point = true
  if (draft.seenDate === '') next.date = true
  if (draft.seenTime === '') next.time = true
  if (draft.seenDate !== '' && draft.seenTime !== '') {
    const seen = new Date(`${draft.seenDate}T${draft.seenTime}`)
    if (Number.isNaN(seen.getTime()) || seen.getTime() > Date.now()) {
      next.future = true
    }
  }
  return next
}

export function SightingPage() {
  const language = useAppSelector((state) => state.language.current)
  const messages = dictionary[language]
  const copy = messages.sighting
  const mapCopy = messages.map
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const drafts = useAppSelector((state) => state.cases.drafts)
  const caseId = searchParams.get('caseId')
  const lostPetCase = useMemo(
    () =>
      [...drafts, ...getLostPetCases()].find(
        (item) => item.id === caseId && item.status !== 'found',
      ) ?? null,
    [caseId, drafts],
  )
  const [draft, setDraft] = useState<SightingDraft>({
    point: null,
    seenDate: '',
    seenTime: '',
    description: '',
    photoUrl: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const photoUrlRef = useRef('')
  const submittedRef = useRef(false)
  const pendingFocus = useRef<string | null>(null)

  // Фото, которое не ушло в отправленное сообщение, освобождаем при уходе со страницы.
  useEffect(() => {
    return () => {
      if (photoUrlRef.current && !submittedRef.current) {
        URL.revokeObjectURL(photoUrlRef.current)
        photoUrlRef.current = ''
      }
    }
  }, [])

  useEffect(() => {
    if (!pendingFocus.current) return
    document.getElementById(`sighting-${pendingFocus.current}`)?.focus()
    pendingFocus.current = null
  }, [errors])

  const contextMarkers = useMemo<SearchMapMarker[]>(
    () =>
      lostPetCase
        ? [
            {
              id: `${lostPetCase.id}-origin`,
              caseId: lostPetCase.id,
              kind: 'lastKnown',
              point: lostPetCase.lastKnown.point,
              seenAtLabel: '',
              description: lostPetCase.lastKnown.description[language],
              note: '',
            },
          ]
        : [],
    [language, lostPetCase],
  )
  const [mapFocus] = useState(() =>
    lostPetCase
      ? { markerId: '', point: lostPetCase.lastKnown.point, token: 1 }
      : null,
  )

  function updateDraft<Key extends keyof SightingDraft>(key: Key, value: SightingDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      const next = { ...current }
      if (key === 'point') delete next.point
      if (key === 'seenDate' || key === 'seenTime') {
        delete next.date
        delete next.time
        delete next.future
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
    if (!lostPetCase) return
    const nextErrors = validate(draft)
    setErrors(nextErrors)
    const firstInvalid = fieldOrder.find((key) => nextErrors[key])
    if (firstInvalid || !draft.point) {
      pendingFocus.current = firstInvalid ?? 'point'
      return
    }
    const description = draft.description.trim()
    const sightingId = `session-sighting-${crypto.randomUUID()}`
    submittedRef.current = true
    dispatch(
      sightingReported({
        caseId: lostPetCase.id,
        sighting: {
          id: sightingId,
          point: draft.point,
          seenAt: `${draft.seenDate}T${draft.seenTime}`,
          description: { kk: description, ru: description },
          source: 'session',
          ...(draft.photoUrl ? { photoUrl: draft.photoUrl } : {}),
        },
      }),
    )
    navigate(
      `/map?caseId=${encodeURIComponent(lostPetCase.id)}&sightingId=${encodeURIComponent(sightingId)}`,
    )
    window.scrollTo({ top: 0 })
  }

  const backTo = lostPetCase ? `/map?caseId=${encodeURIComponent(lostPetCase.id)}` : '/map'
  const errorEntries = fieldOrder.flatMap((key) =>
    errors[key] ? [{ key, message: copy.errors[key] }] : [],
  )
  const reportCopy = messages.report
  const required = (
    <span className="report-page__req">
      <span aria-hidden="true">*</span>
      <span className="report-page__visually-hidden"> ({reportCopy.required})</span>
    </span>
  )
  const optional = <span className="report-page__optional">({reportCopy.optional})</span>
  const step = (value: number) => (
    <span className="report-page__step" aria-hidden="true">
      {value}
    </span>
  )

  return (
    <div className="report-page sighting-page">
      <Header />
      <main className="report-page__main">
        <Link className="report-page__back" to={backTo}>
          {copy.back}
        </Link>
        {!lostPetCase ? (
          <div className="report-page__head report-page__head--illustrated">
            <div className="report-page__head-text">
              <h1 className="report-page__title">{copy.title}</h1>
              <p className="report-page__intro">{copy.notFound}</p>
            </div>
            <Illustration name="sadCat" className="report-page__head-illustration" />
          </div>
        ) : (
          <>
            <section className="sighting-page__case" aria-label={copy.reportFor}>
              <span
                className={`sighting-page__case-mark sighting-page__case-mark--${lostPetCase.animal}`}
                aria-hidden="true"
              />
              <div className="sighting-page__case-body">
                <p className="sighting-page__case-label">{copy.reportFor}</p>
                <p className="sighting-page__case-title">
                  <span className="report-page__visually-hidden">{copy.caseLabel}: </span>
                  <strong>{lostPetCase.title[language].trim() || mapCopy.draftUntitled}</strong>
                </p>
                <p className="sighting-page__case-meta">
                  {lostPetCase.animal === 'cat' ? messages.cat : messages.dog} ·{' '}
                  {lostPetCase.source === 'session' ? mapCopy.draftStatus : mapCopy.demoReport}
                </p>
              </div>
            </section>

            <div className="report-page__head report-page__head--illustrated sighting-page__head">
              <div className="report-page__head-text">
                <h1 className="report-page__title">{copy.title}</h1>
                <ul className="sighting-page__status" aria-label={mapCopy.witnessReport}>
                  <li className="sighting-page__chip sighting-page__chip--kind">
                    {mapCopy.witnessReport}
                  </li>
                  <li className="sighting-page__chip">{mapCopy.unconfirmed}</li>
                  <li className="sighting-page__chip">{mapCopy.sessionOnly}</li>
                </ul>
                <p className="report-page__intro">{copy.intro}</p>
                <p className="report-page__required-note">{reportCopy.requiredNote}</p>
              </div>
              <Illustration name="witness" className="report-page__head-illustration" />
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
                          document.getElementById(`sighting-${entry.key}`)?.focus()
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
              <div
                className={
                  errors.point
                    ? 'report-page__group report-page__map report-page__map--invalid'
                    : 'report-page__group report-page__map'
                }
              >
                <p className="report-page__group-title" id="sighting-point-label">
                  {step(1)}
                  {copy.point} {required}
                </p>
                <p className="report-page__hint" id="sighting-point-hint">
                  {copy.pointHint}
                </p>
                <SearchMap
                  markers={contextMarkers}
                  selectedCaseId={null}
                  focus={mapFocus}
                  selection={draft.point}
                  selectionKind="witness"
                  onSelectCase={() => {}}
                  onPickPoint={(point) => updateDraft('point', point)}
                  labels={{
                    lastKnown: mapCopy.lastKnown,
                    sampleReport: mapCopy.sampleReport,
                    seenAt: mapCopy.seenAt,
                    pickedPoint: copy.pointChosen,
                    witnessReport: mapCopy.witnessReport,
                  }}
                />
                <p className="sighting-page__legend">
                  <span className="sighting-page__legend-item">
                    <span className="sighting-page__shape sighting-page__shape--origin" aria-hidden="true" />
                    {mapCopy.lastKnown}
                  </span>
                  <span className="sighting-page__legend-item">
                    <span className="sighting-page__shape sighting-page__shape--witness" aria-hidden="true" />
                    {mapCopy.witnessReport}
                  </span>
                </p>
                {draft.point ? (
                  <p className="report-page__chosen sighting-page__chosen" role="status">
                    <span aria-hidden="true">✓ </span>
                    {copy.pointChosen}
                  </p>
                ) : null}
                {errors.point ? (
                  <p className="report-page__error" id="sighting-point" tabIndex={-1}>
                    {copy.errors.point}
                  </p>
                ) : null}
              </div>

              <fieldset className="report-page__group">
                <legend className="report-page__group-title">
                  {step(2)}
                  {copy.when}
                </legend>
                <div className="report-page__when">
                  <div className="report-page__field">
                    <label className="report-page__label" htmlFor="sighting-date">
                      {copy.date} {required}
                    </label>
                    <input
                      id="sighting-date"
                      type="date"
                      value={draft.seenDate}
                      aria-required="true"
                      aria-invalid={Boolean(errors.date || errors.future)}
                      aria-describedby={
                        errors.date
                          ? 'sighting-date-error'
                          : errors.future
                            ? 'sighting-future'
                            : undefined
                      }
                      onChange={(event) => updateDraft('seenDate', event.target.value)}
                    />
                    {errors.date ? (
                      <p className="report-page__error" id="sighting-date-error">
                        {copy.errors.date}
                      </p>
                    ) : null}
                  </div>
                  <div className="report-page__field">
                    <label className="report-page__label" htmlFor="sighting-time">
                      {copy.time} {required}
                    </label>
                    <input
                      id="sighting-time"
                      type="time"
                      value={draft.seenTime}
                      aria-required="true"
                      aria-invalid={Boolean(errors.time || errors.future)}
                      aria-describedby={
                        errors.time
                          ? 'sighting-time-error'
                          : errors.future
                            ? 'sighting-future'
                            : undefined
                      }
                      onChange={(event) => updateDraft('seenTime', event.target.value)}
                    />
                    {errors.time ? (
                      <p className="report-page__error" id="sighting-time-error">
                        {copy.errors.time}
                      </p>
                    ) : null}
                  </div>
                </div>
                {errors.future ? (
                  <p className="report-page__error" id="sighting-future" tabIndex={-1}>
                    {copy.errors.future}
                  </p>
                ) : null}
              </fieldset>

              <div className="report-page__group">
                <label className="report-page__group-title" htmlFor="sighting-description">
                  {step(3)}
                  {copy.description} {optional}
                </label>
                <p className="report-page__hint" id="sighting-description-hint">
                  {copy.descriptionHint}
                </p>
                <textarea
                  id="sighting-description"
                  className="sighting-page__description"
                  value={draft.description}
                  maxLength={descriptionMaxLength}
                  aria-describedby="sighting-description-hint sighting-description-counter"
                  onChange={(event) => updateDraft('description', event.target.value)}
                />
                <p className="sighting-page__counter" id="sighting-description-counter">
                  {draft.description.length}/{descriptionMaxLength}
                </p>
              </div>

              <div className="report-page__group">
                <PhotoField
                  id="sighting-photo"
                  labelClassName="report-page__group-title"
                  label={
                    <>
                      {step(4)}
                      {copy.photo} {optional}
                    </>
                  }
                  hint={copy.photoHint}
                  photoUrl={draft.photoUrl}
                  alt={copy.photoAlt}
                  chooseLabel={reportCopy.photoChoose}
                  replaceLabel={reportCopy.photoReplace}
                  removeLabel={copy.photoRemove}
                  onChange={setPhoto}
                />
              </div>

              <div className="report-page__submit">
                <p className="report-page__submit-note" id="sighting-submit-note">
                  {mapCopy.witnessReport} · {mapCopy.unconfirmed}. {mapCopy.sessionOnly}.{' '}
                  {copy.privacy}
                </p>
                <div className="report-page__actions">
                  <button
                    className="report-page__button button button--primary"
                    type="submit"
                    aria-describedby="sighting-submit-note"
                  >
                    {copy.submit}
                  </button>
                  <Link className="button button--secondary sighting-page__cancel" to={backTo}>
                    {copy.cancel}
                  </Link>
                </div>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  )
}
