import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { JobDescriptionInput } from './JobDescriptionInput'

describe('JobDescriptionInput', () => {
  it('should render a textarea with label', () => {
    render(<JobDescriptionInput value="" onChange={() => {}} />)

    expect(
      screen.getByRole('textbox', { name: /job description/i })
    ).toBeInTheDocument()
  })

  it('should display the provided value', () => {
    render(
      <JobDescriptionInput
        value="Software Engineer at Google"
        onChange={() => {}}
      />
    )

    expect(screen.getByRole('textbox')).toHaveValue(
      'Software Engineer at Google'
    )
  })

  it('should call onChange when text is entered', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(<JobDescriptionInput value="" onChange={handleChange} />)

    const textarea = screen.getByRole('textbox')
    await user.type(textarea, 'Hello')

    expect(handleChange).toHaveBeenCalled()
  })

  it('should have a placeholder text', () => {
    render(<JobDescriptionInput value="" onChange={() => {}} />)

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'placeholder',
      expect.stringContaining('Paste')
    )
  })

  it('should be accessible with proper labeling', () => {
    render(<JobDescriptionInput value="" onChange={() => {}} />)

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAccessibleName(/job description/i)
  })
})
