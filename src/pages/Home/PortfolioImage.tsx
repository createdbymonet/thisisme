import { useState } from 'react'
import './PortfolioImage.scss'

type PortfolioImageProps = {
  placeholderLabel: string
  objectPosition?: string
} & ({ src: string; alt: string } | { src?: undefined; alt?: undefined })

export function PortfolioImage({ placeholderLabel, src, alt, objectPosition = 'center' }: PortfolioImageProps) {
  const [failedSrc, setFailedSrc] = useState<string>()
  return <div className="portfolio-image">
    {src && failedSrc !== src
      ? <img key={src} src={src} alt={alt} loading="lazy" style={{ objectPosition }} onError={() => setFailedSrc(src)} />
      : <p role="img" aria-label={alt || placeholderLabel}>{placeholderLabel}</p>}
  </div>
}
