import './PortfolioImage.scss'

type PortfolioImageProps = {
  placeholderLabel: string
} & ({ src: string; alt: string } | { src?: undefined; alt?: undefined })

export function PortfolioImage({ placeholderLabel, src, alt }: PortfolioImageProps) {
  return <div className="portfolio-image">
    {src ? <img src={src} alt={alt} loading="lazy" /> : <p>{placeholderLabel}</p>}
  </div>
}
