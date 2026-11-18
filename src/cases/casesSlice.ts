import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { LostPetCase, SampleSighting } from '../map/types.ts'

type CasesState = {
  drafts: LostPetCase[]
  // Сообщения очевидцев текущего сеанса по id карточки. Не сохраняются в localStorage.
  sessionSightings: Record<string, SampleSighting[]>
}

const initialState: CasesState = {
  drafts: [],
  sessionSightings: {},
}

const casesSlice = createSlice({
  name: 'cases',
  initialState,
  reducers: {
    caseSaved(state, action: PayloadAction<LostPetCase>) {
      const index = state.drafts.findIndex((item) => item.id === action.payload.id)
      if (index === -1) {
        state.drafts.unshift(action.payload)
        return
      }
      state.drafts[index] = action.payload
    },
    // Только карточки текущего сеанса; карточка остаётся в store до перезагрузки.
    caseMarkedFound(state, action: PayloadAction<string>) {
      const item = state.drafts.find((draft) => draft.id === action.payload)
      if (item && item.source === 'session') {
        item.status = 'found'
      }
    },
    sightingReported(
      state,
      action: PayloadAction<{ caseId: string; sighting: SampleSighting }>,
    ) {
      const { caseId, sighting } = action.payload
      const list = state.sessionSightings[caseId] ?? []
      list.push({ ...sighting, source: 'session' })
      state.sessionSightings[caseId] = list
    },
  },
})

export const { caseSaved, caseMarkedFound, sightingReported } = casesSlice.actions
export const casesReducer = casesSlice.reducer
