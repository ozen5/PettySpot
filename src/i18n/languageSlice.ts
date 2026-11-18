import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { isLanguage, type Language } from './dictionary.ts'

export const languageStorageKey = 'prettyspot.language'

type LanguageState = {
  current: Language
}

function readStoredLanguage(): Language {
  if (typeof localStorage === 'undefined') {
    return 'kk'
  }

  try {
    const stored = localStorage.getItem(languageStorageKey)
    if (isLanguage(stored)) {
      return stored
    }
  } catch {
    // Хранилище может быть недоступно, тогда остаётся казахский.
  }

  return 'kk'
}

export function persistLanguage(language: Language) {
  try {
    localStorage.setItem(languageStorageKey, language)
  } catch {
    // Выбор останется до перезагрузки, если хранилище закрыто.
  }
}

const initialState: LanguageState = {
  current: readStoredLanguage(),
}

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    languageSelected(state, action: PayloadAction<Language>) {
      state.current = action.payload
    },
  },
})

export const { languageSelected } = languageSlice.actions
export const languageReducer = languageSlice.reducer
