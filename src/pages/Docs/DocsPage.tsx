import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export default function DocsPage() {
  return <main><SwaggerUI url="/api/openapi.json" /></main>
}
