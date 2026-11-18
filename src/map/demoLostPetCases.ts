import { mapConfig } from './mapConfig.ts'
import type { LostPetCase } from './types.ts'

const points = mapConfig.points

export const demoLostPetCases: readonly LostPetCase[] = [
  {
    id: 'sample-cat-1',
    animal: 'cat',
    source: 'sample',
    title: { kk: 'Мысал: мысық 1', ru: 'Пример: кошка 1' },
    summary: {
      kk: 'Көрсетілім карточкасы. Нақты жоғалған жануар емес.',
      ru: 'Демонстрационная карточка. Это не реально пропавшее животное.',
    },
    lastKnown: {
      point: points.catOneLast,
      seenAt: '2026-11-16T18:20:00',
      description: {
        kk: 'Мысал: соңғы нүкте аула маңында. Бұл нақты орын емес.',
        ru: 'Пример: исходная точка у двора. Это не реальное место.',
      },
    },
    sightings: [
      {
        id: 'sample-cat-1-a',
        point: points.catOneSightingA,
        seenAt: '2026-11-16T19:05:00',
        description: {
          kk: 'Мысал хабарлама: сквер жағында көргендей. Нақты бақылау емес.',
          ru: 'Пример сообщения: будто видели со стороны сквера. Не реальное наблюдение.',
        },
      },
      {
        id: 'sample-cat-1-b',
        point: points.catOneSightingB,
        seenAt: '2026-11-17T08:10:00',
        description: {
          kk: 'Мысал хабарлама: таңертең басқа бұрышта. Бағытқа қосылмайды.',
          ru: 'Пример сообщения: утром на другом углу. Не складывается в маршрут.',
        },
      },
    ],
  },
  {
    id: 'sample-dog-1',
    animal: 'dog',
    source: 'sample',
    title: { kk: 'Мысал: ит 1', ru: 'Пример: собака 1' },
    summary: {
      kk: 'Көрсетілім карточкасы. Нақты жоғалған жануар емес.',
      ru: 'Демонстрационная карточка. Это не реально пропавшее животное.',
    },
    lastKnown: {
      point: points.dogOneLast,
      seenAt: '2026-11-15T16:40:00',
      description: {
        kk: 'Мысал: соңғы нүкте алаңқай маңында. Бұл нақты орын емес.',
        ru: 'Пример: исходная точка у площадки. Это не реальное место.',
      },
    },
    sightings: [
      {
        id: 'sample-dog-1-a',
        point: points.dogOneSightingA,
        seenAt: '2026-11-15T17:25:00',
        description: {
          kk: 'Мысал хабарлама: көше бойымен өткендей. Нақты бақылау емес.',
          ru: 'Пример сообщения: будто прошла вдоль улицы. Не реальное наблюдение.',
        },
      },
      {
        id: 'sample-dog-1-b',
        point: points.dogOneSightingB,
        seenAt: '2026-11-16T09:15:00',
        description: {
          kk: 'Мысал хабарлама: келесі күні басқа жерде. Бағытқа қосылмайды.',
          ru: 'Пример сообщения: на следующий день в другом месте. Не маршрут.',
        },
      },
    ],
  },
  {
    id: 'sample-cat-2',
    animal: 'cat',
    source: 'sample',
    title: { kk: 'Мысал: мысық 2', ru: 'Пример: кошка 2' },
    summary: {
      kk: 'Көрсетілім карточкасы. Нақты жоғалған жануар емес.',
      ru: 'Демонстрационная карточка. Это не реально пропавшее животное.',
    },
    lastKnown: {
      point: points.catTwoLast,
      seenAt: '2026-11-14T21:05:00',
      description: {
        kk: 'Мысал: соңғы нүкте тыныш аулада. Бұл нақты орын емес.',
        ru: 'Пример: исходная точка в тихом дворе. Это не реальное место.',
      },
    },
    sightings: [
      {
        id: 'sample-cat-2-a',
        point: points.catTwoSighting,
        seenAt: '2026-11-15T07:40:00',
        description: {
          kk: 'Мысал хабарлама: таңертеңгі бір нүкте. Нақты бақылау емес.',
          ru: 'Пример сообщения: одна утренняя точка. Не реальное наблюдение.',
        },
      },
    ],
  },
  {
    id: 'sample-dog-2',
    animal: 'dog',
    source: 'sample',
    title: { kk: 'Мысал: ит 2', ru: 'Пример: собака 2' },
    summary: {
      kk: 'Көрсетілім карточкасы. Нақты жоғалған жануар емес.',
      ru: 'Демонстрационная карточка. Это не реально пропавшее животное.',
    },
    lastKnown: {
      point: points.dogTwoLast,
      seenAt: '2026-11-13T13:10:00',
      description: {
        kk: 'Мысал: соңғы нүкте саябақ шетінде. Бұл нақты орын емес.',
        ru: 'Пример: исходная точка у края парка. Это не реальное место.',
      },
    },
    sightings: [
      {
        id: 'sample-dog-2-a',
        point: points.dogTwoSighting,
        seenAt: '2026-11-13T15:00:00',
        description: {
          kk: 'Мысал хабарлама: кейінірек басқа нүктеде. Бағытқа қосылмайды.',
          ru: 'Пример сообщения: позже в другой точке. Не складывается в маршрут.',
        },
      },
    ],
  },
]
