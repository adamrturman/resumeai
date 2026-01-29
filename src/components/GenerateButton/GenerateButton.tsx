import './GenerateButton.css'

interface GenerateButtonProps {
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}

export function GenerateButton({
  onClick,
  disabled,
  loading,
}: GenerateButtonProps) {
  return (
    <button
      className="generate-button"
      onClick={onClick}
      disabled={disabled || loading}
    >
      Generate Resume
    </button>
  )
}
