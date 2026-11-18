import { useAppSelector } from '../app/hooks.ts'
import { dictionary, type IllustrationName } from '../i18n/dictionary.ts'
import nightSearch from '../assets/illustrations/night-search.webp'
import sadCat from '../assets/illustrations/sad-cat.webp'
import poster from '../assets/illustrations/poster.webp'
import witness from '../assets/illustrations/witness.webp'
import pawTrail from '../assets/illustrations/paw-trail.webp'
import reunion from '../assets/illustrations/reunion.webp'
import './Illustration.scss'

// Intrinsic sizes of the optimized WebP files: width/height attrs reserve space (no layout shift).
const sources: Record<IllustrationName, { src: string; width: number; height: number }> = {
  nightSearch: { src: nightSearch, width: 1152, height: 864 },
  sadCat: { src: sadCat, width: 800, height: 600 },
  poster: { src: poster, width: 800, height: 600 },
  witness: { src: witness, width: 800, height: 600 },
  pawTrail: { src: pawTrail, width: 1200, height: 675 },
  reunion: { src: reunion, width: 800, height: 600 },
}

type IllustrationProps = {
  name: IllustrationName
  className?: string
  /** Above-the-fold image (home hero): load immediately with high priority. */
  priority?: boolean
  /** Purely decorative next to text that already says the same: empty alt. */
  decorative?: boolean
}

export function Illustration({ name, className, priority = false, decorative = false }: IllustrationProps) {
  const language = useAppSelector((state) => state.language.current)
  const { src, width, height } = sources[name]

  return (
    <img
      className={className ? `illustration ${className}` : 'illustration'}
      src={src}
      width={width}
      height={height}
      alt={decorative ? '' : dictionary[language].illustrations[name]}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
    />
  )
}
