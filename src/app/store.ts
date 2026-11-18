import { configureStore } from '@reduxjs/toolkit'
import { casesReducer } from '../cases/casesSlice.ts'
import { languageReducer } from '../i18n/languageSlice.ts'

// Общие редьюсеры подключаются здесь, когда состояние нужно нескольким экранам.
export const store = configureStore({
  reducer: {
    language: languageReducer,
    cases: casesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
