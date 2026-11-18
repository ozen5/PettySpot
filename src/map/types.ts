export type AnimalKind = 'cat' | 'dog'

export type GeoPoint = {
  latitude: number
  longitude: number
}

export type LocalizedText = {
  kk: string
  ru: string
}

export type SampleSighting = {
  id: string
  point: GeoPoint
  seenAt: string
  description: LocalizedText
  // 'session' — сообщение очевидца, созданное в текущем сеансе (только Redux, без сервера).
  source?: 'sample' | 'session'
  // Локальный object URL фото; живёт только в памяти текущей вкладки.
  photoUrl?: string
}

export type LostPetCase = {
  id: string
  animal: AnimalKind
  source: 'sample' | 'session'
  // Статус поиска; не задан у демонстрационных карточек — значит, поиск активен.
  status?: 'active' | 'found'
  title: LocalizedText
  summary: LocalizedText
  lastKnown: {
    point: GeoPoint
    seenAt: string
    description: LocalizedText
  }
  sightings: SampleSighting[]
}
