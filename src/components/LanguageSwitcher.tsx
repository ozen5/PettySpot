import { languageSelected } from '../i18n/languageSlice.ts'
import {
  dictionary,
  languageLabels,
  languages,
} from '../i18n/dictionary.ts'
import { useAppDispatch, useAppSelector } from '../app/hooks.ts'
import './LanguageSwitcher.scss'

export function LanguageSwitcher() {
  const dispatch = useAppDispatch()
  const language = useAppSelector((state) => state.language.current)
  const messages = dictionary[language]

  return (
    <div
      className="language-switcher"
      role="group"
      aria-label={messages.languageSwitcher}
    >
      {languages.map((code) => {
        const selected = code === language

        return (
          <button
            key={code}
            type="button"
            className={
              selected
                ? 'language-switcher__option language-switcher__option--current'
                : 'language-switcher__option'
            }
            lang={code}
            aria-pressed={selected}
            onClick={() => dispatch(languageSelected(code))}
          >
            {languageLabels[code]}
          </button>
        )
      })}
    </div>
  )
}
