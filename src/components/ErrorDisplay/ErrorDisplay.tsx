import './ErrorDisplay.css'

interface ErrorDisplayProps {
  error: string | null
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) {
    return null
  }

  return (
    <div role="alert" className="error-display">
      {error}
    </div>
  )
}
