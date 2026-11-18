import { useRef, type ReactNode } from 'react'
import './PhotoField.scss'

type PhotoFieldProps = {
  id: string
  label: ReactNode
  labelClassName?: string
  hint: string
  photoUrl: string
  alt: string
  chooseLabel: string
  replaceLabel: string
  removeLabel: string
  onChange: (file: File | null) => void
}

// Optional local photo: a native file input with a visible button-style label,
// a preview only when a photo exists, and replace/remove actions.
export function PhotoField({
  id,
  label,
  labelClassName = 'photo-field__label',
  hint,
  photoUrl,
  alt,
  chooseLabel,
  replaceLabel,
  removeLabel,
  onChange,
}: PhotoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const hasPhoto = photoUrl !== ''

  return (
    <div className="photo-field">
      <p className={labelClassName} id={`${id}-label`}>
        {label}
      </p>
      <p className="photo-field__hint" id={`${id}-hint`}>
        {hint}
      </p>
      <div className={hasPhoto ? 'photo-field__body photo-field__body--filled' : 'photo-field__body'}>
        {hasPhoto ? (
          <img className="report-page__photo photo-field__preview" src={photoUrl} alt={alt} />
        ) : null}
        <div className="photo-field__actions">
          <input
            ref={inputRef}
            className="photo-field__input"
            id={id}
            type="file"
            accept="image/*"
            aria-labelledby={`${id}-label ${id}-pick`}
            aria-describedby={`${id}-hint`}
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null
              if (file && !file.type.startsWith('image/')) {
                event.target.value = ''
                return
              }
              if (file) onChange(file)
            }}
          />
          <label className="photo-field__pick" id={`${id}-pick`} htmlFor={id}>
            {hasPhoto ? replaceLabel : chooseLabel}
          </label>
          {hasPhoto ? (
            <button
              className="photo-field__remove"
              type="button"
              onClick={() => {
                if (inputRef.current) inputRef.current.value = ''
                onChange(null)
                inputRef.current?.focus()
              }}
            >
              {removeLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
