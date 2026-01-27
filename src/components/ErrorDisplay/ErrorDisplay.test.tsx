import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorDisplay } from './ErrorDisplay'

describe('ErrorDisplay', () => {
  it('should render nothing when no error is provided', () => {
    const { container } = render(<ErrorDisplay error={null} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('should display error message when error is provided', () => {
    render(<ErrorDisplay error="Something went wrong" />)

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
  })

  it('should have accessible alert role', () => {
    render(<ErrorDisplay error="Network error" />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should display error with appropriate styling class', () => {
    render(<ErrorDisplay error="Test error" />)

    expect(screen.getByRole('alert')).toHaveClass('error-display')
  })
})
