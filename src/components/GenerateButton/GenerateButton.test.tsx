import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GenerateButton } from './GenerateButton'

describe('GenerateButton', () => {
  it('should render a button with "Generate Resume" text', () => {
    render(<GenerateButton onClick={() => {}} />)

    expect(
      screen.getByRole('button', { name: /generate resume/i })
    ).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<GenerateButton onClick={handleClick} />)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<GenerateButton onClick={() => {}} disabled />)

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should be disabled when loading prop is true', () => {
    render(<GenerateButton onClick={() => {}} loading />)

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should be disabled when no job description is provided', () => {
    render(<GenerateButton onClick={() => {}} disabled />)

    expect(screen.getByRole('button')).toBeDisabled()
  })
})
