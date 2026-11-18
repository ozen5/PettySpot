import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Header } from '../components/Header.tsx'
import { Illustration } from '../components/Illustration.tsx'
import { SearchMap, type SearchMapMarker } from '../components/SearchMap.tsx'
import { useAppDispatch, useAppSelector } from '../app/hooks.ts'
import { caseMarkedFound } from '../cases/casesSlice.ts'
import { dictionary, type Language } from '../i18n/dictionary.ts'
import { getLostPetCases } from '../map/getLostPetCases.ts'
import type { AnimalKind, GeoPoint, LostPetCase, SampleSighting } from '../map/types.ts'
import './MapPage.scss'

type AnimalFilter = 'all' | AnimalKind

function formatSeenAt(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const pad = (part: number) => String(part).padStart(2, '0')
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}, ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function textOf(item: { kk: string; ru: string }, language: Language) {
  return item[language]
}

function originMarkerId(caseId: string) {
  return `${caseId}-origin`
}

function seenAtTime(value: string) {
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? 0 : time
}

// Демонстрационные и сеансовые наблюдения одной карточки, по времени (сначала ранние).
function sightingsOf(
  item: LostPetCase,
  sessionSightings: Record<string, SampleSighting[]>,
): SampleSighting[] {
  return [...item.sightings, ...(sessionSightings[item.id] ?? [])].sort(
    (a, b) => seenAtTime(a.seenAt) - seenAtTime(b.seenAt),
  )
}

export function MapPage() {
  const language = useAppSelector((state) => state.language.current)
  const copy = dictionary[language].map
  const dispatch = useAppDispatch()
  const drafts = useAppSelector((state) => state.cases.drafts)
  const sessionSightings = useAppSelector((state) => state.cases.sessionSightings)
  const [searchParams] = useSearchParams()
  // Активный поиск: карточки со статусом «найден» остаются в Redux, но не показываются.
  const cases = useMemo(
    () => [...drafts, ...getLostPetCases()].filter((item) => item.status !== 'found'),
    [drafts],
  )
  const requestedCase = cases.find((item) => item.id === searchParams.get('caseId'))
  const requestedSighting = requestedCase
    ? sessionSightings[requestedCase.id]?.find(
        (item) => item.id === searchParams.get('sightingId'),
      )
    : undefined
  const [filter, setFilter] = useState<AnimalFilter>('all')
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(
    requestedCase?.id ?? null,
  )
  const [focusToken, setFocusToken] = useState(1)
  const [focus, setFocus] = useState<{
    markerId: string
    point: GeoPoint
    token: number
  } | null>(
    requestedSighting
      ? {
          markerId: requestedSighting.id,
          point: requestedSighting.point,
          token: 1,
        }
      : requestedCase
        ? {
            markerId: originMarkerId(requestedCase.id),
            point: requestedCase.lastKnown.point,
            token: 1,
          }
        : null,
  )
  const [addedSighting] = useState(() =>
    requestedCase && requestedSighting
      ? { caseId: requestedCase.id, sightingId: requestedSighting.id }
      : null,
  )
  const addedSightingId = addedSighting?.sightingId ?? null
  const [confirmingFoundId, setConfirmingFoundId] = useState<string | null>(null)
  const [foundCaseId, setFoundCaseId] = useState<string | null>(null)
  // Найденная карточка не удаляется из Redux, поэтому её название доступно на любом языке.
  const foundCase = drafts.find((item) => item.id === foundCaseId && item.status === 'found')
  const foundName = foundCase
    ? textOf(foundCase.title, language).trim() || copy.draftUntitled
    : null

  const visibleCases = useMemo(
    () => cases.filter((item) => filter === 'all' || item.animal === filter),
    [cases, filter],
  )
  const selectedCase = visibleCases.find((item) => item.id === selectedCaseId) ?? null

  const markers = useMemo<SearchMapMarker[]>(
    () =>
      visibleCases.flatMap((item) => [
        {
          id: originMarkerId(item.id),
          caseId: item.id,
          kind: 'lastKnown',
          point: item.lastKnown.point,
          seenAtLabel: formatSeenAt(item.lastKnown.seenAt),
          description: textOf(item.lastKnown.description, language),
          note: item.source === 'session' ? copy.draftNotice : copy.demoNotice,
        },
        ...sightingsOf(item, sessionSightings).map((sighting) =>
          sighting.source === 'session'
            ? {
                id: sighting.id,
                caseId: item.id,
                kind: 'witnessReport' as const,
                point: sighting.point,
                seenAtLabel: formatSeenAt(sighting.seenAt),
                description: textOf(sighting.description, language),
                note: `${copy.unconfirmed}. ${copy.sessionOnly}.`,
              }
            : {
                id: sighting.id,
                caseId: item.id,
                kind: 'sampleReport' as const,
                point: sighting.point,
                seenAtLabel: formatSeenAt(sighting.seenAt),
                description: textOf(sighting.description, language),
                note: copy.demoNotice,
              },
        ),
      ]),
    [
      copy.demoNotice,
      copy.draftNotice,
      copy.sessionOnly,
      copy.unconfirmed,
      language,
      sessionSightings,
      visibleCases,
    ],
  )

  function selectFilter(next: AnimalFilter) {
    const stillVisible =
      selectedCaseId !== null &&
      cases.some(
        (item) =>
          item.id === selectedCaseId && (next === 'all' || item.animal === next),
      )
    setFilter(next)
    if (!stillVisible) {
      setSelectedCaseId(null)
      setFocus(null)
    }
  }

  function confirmFound(item: LostPetCase) {
    if (item.source !== 'session') return
    dispatch(caseMarkedFound(item.id))
    setConfirmingFoundId(null)
    setSelectedCaseId(null)
    setFocus(null)
    setFoundCaseId(item.id)
  }

  const mapAreaRef = useRef<HTMLDivElement>(null)
  const scrollToMapRef = useRef(false)

  // На узком экране список под картой: после выбора возвращаем карту в поле зрения
  // (уже после отрисовки панели карточки, чтобы прокрутку не сбил сдвиг вёрстки).
  useEffect(() => {
    if (!scrollToMapRef.current) return
    scrollToMapRef.current = false
    mapAreaRef.current?.scrollIntoView({ block: 'start' })
  }, [focusToken])

  function selectCase(item: LostPetCase) {
    scrollToMapRef.current = window.matchMedia('(max-width: 64rem)').matches
    setConfirmingFoundId(null)
    setFoundCaseId(null)
    const token = focusToken + 1
    setFocusToken(token)
    setSelectedCaseId(item.id)
    setFocus({
      markerId: originMarkerId(item.id),
      point: item.lastKnown.point,
      token,
    })
  }

  const filterOptions = [
    ['all', copy.filterAll],
    ['cat', copy.filterCats],
    ['dog', copy.filterDogs],
  ] as const

  function renderStory(item: LostPetCase) {
    const sessionCount = sessionSightings[item.id]?.length ?? 0
    const sightings = sightingsOf(item, sessionSightings)
    return (
      <article className="map-page__story" aria-labelledby={`story-${item.id}`}>
        <p className="map-page__story-label">{copy.selectedLabel}</p>
        <h2 className="map-page__story-title" id={`story-${item.id}`}>
          {textOf(item.title, language).trim() || copy.draftUntitled}
        </h2>
        <p className="map-page__story-tags">
          <span className="map-page__tag">
            {item.animal === 'cat' ? dictionary[language].cat : dictionary[language].dog}
          </span>
          {item.source === 'session' ? (
            <span className="map-page__tag map-page__tag--session">{copy.draftStatus}</span>
          ) : (
            <span className="map-page__tag">{copy.demoReport}</span>
          )}
        </p>
        <p className="map-page__story-summary">{textOf(item.summary, language)}</p>
        <p className="map-page__story-counts">
          <span>
            {copy.sampleReports}: {item.sightings.length}
          </span>
          {sessionCount > 0 ? (
            <span>
              {copy.sessionReports}: {sessionCount}
            </span>
          ) : null}
        </p>

        <div className="map-page__selected">
          <Link
            className="button button--primary map-page__action"
            to={`/map/sighting?caseId=${encodeURIComponent(item.id)}`}
          >
            {copy.reportSighting}
          </Link>
          {item.source === 'session' ? (
            confirmingFoundId === item.id ? (
              <div
                className="map-page__confirm"
                role="group"
                aria-labelledby={`found-title-${item.id}`}
              >
                <p className="map-page__confirm-title" id={`found-title-${item.id}`}>
                  {copy.confirmFoundTitle}
                </p>
                <p className="map-page__confirm-text">{copy.confirmFoundText}</p>
                <div className="map-page__confirm-actions">
                  <button
                    type="button"
                    className="button button--primary map-page__action"
                    onClick={() => confirmFound(item)}
                  >
                    {copy.confirmFoundYes}
                  </button>
                  <button
                    type="button"
                    className="button button--secondary map-page__confirm-cancel"
                    onClick={() => setConfirmingFoundId(null)}
                  >
                    {copy.confirmFoundNo}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="button button--secondary map-page__found"
                onClick={() => {
                  setFoundCaseId(null)
                  setConfirmingFoundId(item.id)
                }}
              >
                {copy.markFound}
              </button>
            )
          ) : null}
        </div>

        <div className="map-page__origin">
          <span className="map-page__shape map-page__shape--origin" aria-hidden="true" />
          <div>
            <p className="map-page__origin-kind">{copy.lastKnown}</p>
            <p className="map-page__sighting-meta">
              {copy.seenAt}: {formatSeenAt(item.lastKnown.seenAt)}
            </p>
            <p className="map-page__sighting-text">
              {textOf(item.lastKnown.description, language)}
            </p>
          </div>
        </div>

        <h3 className="map-page__sightings-title">{copy.sightingsTitle}</h3>
        <p className="map-page__sightings-order">{copy.sightingsOrder}</p>
        {sightings.length === 0 ? (
          <p className="map-page__sightings-order">{copy.noSightings}</p>
        ) : (
          <ol className="map-page__sightings">
            {sightings.map((sighting) => (
              <li
                key={sighting.id}
                className={
                  sighting.id === addedSightingId
                    ? 'map-page__sighting map-page__sighting--new'
                    : 'map-page__sighting'
                }
              >
                <span
                  className={
                    sighting.source === 'session'
                      ? 'map-page__shape map-page__shape--witness'
                      : 'map-page__shape map-page__shape--report'
                  }
                  aria-hidden="true"
                />
                <div className="map-page__sighting-body">
                  <p className="map-page__sighting-kind">
                    {copy.witnessReport} · {copy.unconfirmed}
                  </p>
                  <p className="map-page__sighting-meta">
                    {copy.seenAt}: {formatSeenAt(sighting.seenAt)}
                  </p>
                  {textOf(sighting.description, language).trim() ? (
                    <p className="map-page__sighting-text">
                      {textOf(sighting.description, language)}
                    </p>
                  ) : null}
                  {sighting.photoUrl ? (
                    <img
                      className="map-page__sighting-photo"
                      src={sighting.photoUrl}
                      alt={copy.sightingPhotoAlt}
                    />
                  ) : null}
                  <p className="map-page__sighting-note">
                    {sighting.source === 'session' ? copy.sessionOnly : copy.demoReport}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </article>
    )
  }

  return (
    <div className="map-page">
      <Header />
      <main className="map-page__main">
        <div className="map-page__top">
          <div className="map-page__heading">
            <h1 className="map-page__title">{copy.title}</h1>
            <p className="map-page__notice">{copy.demoNotice}</p>
          </div>
          <div className="map-page__filters" role="group" aria-label={copy.filtersLabel}>
            {filterOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={
                  filter === value
                    ? 'map-page__filter map-page__filter--current'
                    : 'map-page__filter'
                }
                aria-pressed={filter === value}
                onClick={() => selectFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {addedSighting && selectedCase?.id === addedSighting.caseId ? (
          <p className="map-page__status" role="status">
            {copy.sightingAdded}
          </p>
        ) : null}
        {foundName ? (
          <div className="map-page__status map-page__status--found" role="status">
            <Illustration name="reunion" className="map-page__found-illustration" decorative />
            <p>{copy.foundSuccess.replace('{name}', foundName)}</p>
          </div>
        ) : null}
        <div className="map-page__layout">
          <div className="map-page__map-area" ref={mapAreaRef}>
            <div className="map-page__map">
              <SearchMap
                markers={markers}
                selectedCaseId={selectedCase?.id ?? null}
                focus={selectedCase ? focus : null}
                labels={{
                  lastKnown: copy.lastKnown,
                  sampleReport: copy.sampleReport,
                  seenAt: copy.seenAt,
                  pickedPoint: copy.lastKnown,
                  witnessReport: `${copy.witnessReport} · ${copy.unconfirmed}`,
                }}
                onSelectCase={(caseId) => setSelectedCaseId(caseId)}
              />
            </div>
            <div className="map-page__legend" role="group" aria-label={copy.legendTitle}>
              <span className="map-page__legend-title">{copy.legendTitle}:</span>
              <span className="map-page__legend-item">
                <span className="map-page__shape map-page__shape--origin" aria-hidden="true" />
                {copy.lastKnown}
              </span>
              <span className="map-page__legend-item">
                <span className="map-page__shape map-page__shape--report" aria-hidden="true" />
                {copy.sampleReport}
              </span>
              <span className="map-page__legend-item">
                <span className="map-page__shape map-page__shape--witness" aria-hidden="true" />
                {copy.witnessReport} ({copy.sessionOnly.toLowerCase()})
              </span>
            </div>
          </div>
          <aside className="map-page__side">
            {selectedCase ? (
              renderStory(selectedCase)
            ) : (
              <p className="map-page__prompt">{copy.selectPrompt}</p>
            )}
            <section className="map-page__list" aria-labelledby="map-list-title">
              <h2 className="map-page__list-title" id="map-list-title">
                {selectedCase ? copy.otherCards : copy.listTitle}
              </h2>
              {visibleCases.length === 0 ? (
                <div className="map-page__empty">
                  <Illustration name="sadCat" className="map-page__empty-illustration" />
                  <p>{copy.empty}</p>
                </div>
              ) : (
                <ul className="map-page__cases">
                  {visibleCases.map((item) => {
                    const total =
                      item.sightings.length + (sessionSightings[item.id]?.length ?? 0)
                    const current = item.id === selectedCase?.id
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          className={
                            current ? 'map-page__case map-page__case--current' : 'map-page__case'
                          }
                          aria-pressed={current}
                          onClick={() => selectCase(item)}
                        >
                          <span
                            className="map-page__shape map-page__shape--origin"
                            aria-hidden="true"
                          />
                          <span className="map-page__case-body">
                            <span className="map-page__case-title">
                              {textOf(item.title, language).trim() || copy.draftUntitled}
                            </span>
                            <span className="map-page__case-meta">
                              {item.animal === 'cat'
                                ? dictionary[language].cat
                                : dictionary[language].dog}
                              {' · '}
                              {formatSeenAt(item.lastKnown.seenAt)}
                              {item.source === 'session' ? (
                                <span className="map-page__case-status">
                                  {' · '}
                                  {copy.draftStatus}
                                </span>
                              ) : null}
                            </span>
                          </span>
                          <span className="map-page__case-count" title={copy.sightingsTitle}>
                            <span className="map-page__shape map-page__shape--report" aria-hidden="true" />
                            <span className="map-page__visually-hidden">
                              {copy.sightingsTitle}:{' '}
                            </span>
                            {total}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
