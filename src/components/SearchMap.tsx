import { useEffect, useMemo, useRef, type ComponentProps } from 'react'
import { divIcon, type LatLngTuple, type Marker as LeafletMarker } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import type { GeoPoint } from '../map/types.ts'
import { mapConfig } from '../map/mapConfig.ts'
import 'leaflet/dist/leaflet.css'
import './SearchMap.scss'

// Keep auto-panned popups clear of the top-left zoom buttons (10px offset + 2 × 44px).
const POPUP_PAD_TOP_LEFT: [number, number] = [12, 112]
const POPUP_PAD_BOTTOM_RIGHT: [number, number] = [12, 12]

export type SearchMapMarker = {
  id: string
  caseId: string
  kind: 'lastKnown' | 'sampleReport' | 'witnessReport'
  point: GeoPoint
  seenAtLabel: string
  description: string
  note: string
}

type SearchMapProps = {
  markers: readonly SearchMapMarker[]
  selectedCaseId: string | null
  focus: { markerId: string; point: GeoPoint; token: number } | null
  labels: {
    lastKnown: string
    sampleReport: string
    seenAt: string
    pickedPoint: string
    witnessReport?: string
  }
  onSelectCase: (caseId: string) => void
  selection?: GeoPoint | null
  selectionKind?: 'origin' | 'witness'
  onPickPoint?: (point: GeoPoint) => void
}

function MapPicker({
  onPickPoint,
}: {
  onPickPoint?: (point: GeoPoint) => void
}) {
  useMapEvents({
    click(event) {
      if (!onPickPoint) return
      onPickPoint({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      })
    },
  })

  return null
}

// Стабильная ссылка на координаты: иначе react-leaflet вызывает setLatLng на каждом
// рендере, и открытый попап пытается пересчитать панораму во время перелёта карты.
function useStablePosition(point: GeoPoint): LatLngTuple {
  const { latitude, longitude } = point
  return useMemo<LatLngTuple>(() => [latitude, longitude], [latitude, longitude])
}

function StableMarker({
  point,
  ...props
}: Omit<ComponentProps<typeof Marker>, 'position'> & { point: GeoPoint }) {
  const position = useStablePosition(point)
  return <Marker position={position} {...props} />
}

function MapFocus({
  focus,
  markerRefs,
}: {
  focus: SearchMapProps['focus']
  markerRefs: { current: Record<string, LeafletMarker | null> }
}) {
  const map = useMap()

  useEffect(() => {
    if (!focus) return
    const open = () => {
      markerRefs.current[focus.markerId]?.openPopup()
    }
    map.flyTo(
      [focus.point.latitude, focus.point.longitude],
      mapConfig.selectedZoom,
    )
    map.once('moveend', open)
    return () => {
      map.off('moveend', open)
    }
  }, [focus, map, markerRefs])

  return null
}

export function SearchMap({
  markers,
  selectedCaseId,
  focus,
  labels,
  onSelectCase,
  selection = null,
  selectionKind = 'origin',
  onPickPoint,
}: SearchMapProps) {
  const markerRefs = useRef<Record<string, LeafletMarker | null>>({})
  const icons = useMemo(
    () => ({
      origin: divIcon({
        className: 'search-map__pin search-map__pin--origin',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
      originSelected: divIcon({
        className: 'search-map__pin search-map__pin--origin search-map__pin--selected',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      }),
      report: divIcon({
        className: 'search-map__pin search-map__pin--report',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      }),
      witness: divIcon({
        className: 'search-map__pin search-map__pin--witness',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    }),
    [],
  )

  useEffect(() => {
    if (!focus) return
    markerRefs.current[focus.markerId]?.openPopup()
  }, [focus])

  return (
    <MapContainer
      className={onPickPoint ? 'search-map search-map--picker' : 'search-map'}
      center={[mapConfig.center.latitude, mapConfig.center.longitude]}
      zoom={mapConfig.defaultZoom}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapPicker onPickPoint={onPickPoint} />
      <MapFocus focus={focus} markerRefs={markerRefs} />
      {selection ? (
        <StableMarker
          point={selection}
          icon={selectionKind === 'witness' ? icons.witness : icons.originSelected}
          alt={labels.pickedPoint}
          zIndexOffset={1000}
        />
      ) : null}
      {markers.map((marker) => {
        const selected = marker.caseId === selectedCaseId
        const icon =
          marker.kind === 'lastKnown'
            ? selected
              ? icons.originSelected
              : icons.origin
            : marker.kind === 'witnessReport'
              ? icons.witness
              : icons.report
        const kindLabel =
          marker.kind === 'lastKnown'
            ? labels.lastKnown
            : marker.kind === 'witnessReport'
              ? (labels.witnessReport ?? labels.sampleReport)
              : labels.sampleReport

        return (
          <StableMarker
            key={marker.id}
            point={marker.point}
            icon={icon}
            alt={kindLabel}
            zIndexOffset={selected && marker.kind === 'lastKnown' ? 500 : 0}
            ref={(instance) => {
              markerRefs.current[marker.id] = instance
            }}
            eventHandlers={{
              click: () => onSelectCase(marker.caseId),
            }}
          >
            <Popup
              maxWidth={260}
              autoPanPaddingTopLeft={POPUP_PAD_TOP_LEFT}
              autoPanPaddingBottomRight={POPUP_PAD_BOTTOM_RIGHT}
            >
              <p className="search-map__popup-kind">
                {kindLabel}
              </p>
              <p className="search-map__popup-time">
                {labels.seenAt}: {marker.seenAtLabel}
              </p>
              <p className="search-map__popup-text">{marker.description}</p>
              <p className="search-map__popup-note">{marker.note}</p>
            </Popup>
          </StableMarker>
        )
      })}
    </MapContainer>
  )
}
