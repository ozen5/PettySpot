import type { GeoPoint } from './types.ts'

// Учебный регион. Координаты можно заменить, не трогая компоненты карты.
export const mapConfig = {
  center: {
    latitude: 43.238949,
    longitude: 76.889709,
  } satisfies GeoPoint,
  defaultZoom: 12,
  selectedZoom: 15,
  points: {
    catOneLast: { latitude: 43.2422, longitude: 76.8848 },
    catOneSightingA: { latitude: 43.2471, longitude: 76.8944 },
    catOneSightingB: { latitude: 43.2384, longitude: 76.8762 },
    dogOneLast: { latitude: 43.2316, longitude: 76.9015 },
    dogOneSightingA: { latitude: 43.2268, longitude: 76.8879 },
    dogOneSightingB: { latitude: 43.2369, longitude: 76.9128 },
    catTwoLast: { latitude: 43.2514, longitude: 76.9086 },
    catTwoSighting: { latitude: 43.2466, longitude: 76.9194 },
    dogTwoLast: { latitude: 43.2238, longitude: 76.9122 },
    dogTwoSighting: { latitude: 43.2194, longitude: 76.8991 },
  } satisfies Record<string, GeoPoint>,
}
