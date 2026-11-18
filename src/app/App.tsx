import { useLayoutEffect } from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { dictionary } from '../i18n/dictionary.ts'
import { persistLanguage } from '../i18n/languageSlice.ts'
import { useAppSelector } from './hooks.ts'
import { router } from './router.tsx'
import { store } from './store.ts'

export function App() {
  return (
    <Provider store={store}>
      <LanguageSync />
      <RouterProvider router={router} />
    </Provider>
  )
}

function LanguageSync() {
  const language = useAppSelector((state) => state.language.current)
  const messages = dictionary[language]

  useLayoutEffect(() => {
    document.documentElement.lang = language
    document.title = messages.brand
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', messages.description)
    persistLanguage(language)
  }, [language, messages.brand, messages.description])

  return null
}
