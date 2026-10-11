import './PortfolioImage.scss'

type PortfolioImageProps = {
  kind: 'profile' | 'project'
  placeholderLabel: string
} & ({ src: string; alt: string } | { src?: undefined; alt?: undefined })

export function PortfolioImage({ kind, placeholderLabel, src, alt }: PortfolioImageProps) {
  return <div className={`portfolio-image portfolio-image--${kind}`}>
    {src ? <img src={src} alt={alt} loading="lazy" /> : <p>{placeholderLabel}</p>}
  </div>
}
