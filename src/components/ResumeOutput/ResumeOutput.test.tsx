import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResumeOutput } from './ResumeOutput'

describe('ResumeOutput', () => {
  it('should render nothing when no resume content is provided', () => {
    const { container } = render(
      <ResumeOutput
        content={null}
        companyName=""
        onCopy={() => {}}
        onDownload={() => {}}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('should display resume content when provided', () => {
    render(
      <ResumeOutput
        content="## Summary\nExperienced developer"
        companyName="Google"
        onCopy={() => {}}
        onDownload={() => {}}
      />
    )

    expect(screen.getByText(/summary/i)).toBeInTheDocument()
    expect(screen.getByText(/experienced developer/i)).toBeInTheDocument()
  })

  it('should have a copy button', () => {
    render(
      <ResumeOutput
        content="Resume content"
        companyName="Google"
        onCopy={() => {}}
        onDownload={() => {}}
      />
    )

    expect(
      screen.getByRole('button', { name: /copy/i })
    ).toBeInTheDocument()
  })

  it('should call onCopy when copy button is clicked', async () => {
    const user = userEvent.setup()
    const handleCopy = vi.fn()

    render(
      <ResumeOutput
        content="Resume content"
        companyName="Google"
        onCopy={handleCopy}
        onDownload={() => {}}
      />
    )

    await user.click(screen.getByRole('button', { name: /copy/i }))
    expect(handleCopy).toHaveBeenCalledTimes(1)
  })

  it('should have a download PDF button', () => {
    render(
      <ResumeOutput
        content="Resume content"
        companyName="Google"
        onCopy={() => {}}
        onDownload={() => {}}
      />
    )

    expect(
      screen.getByRole('button', { name: /download pdf/i })
    ).toBeInTheDocument()
  })

  it('should call onDownload when download button is clicked', async () => {
    const user = userEvent.setup()
    const handleDownload = vi.fn()

    render(
      <ResumeOutput
        content="Resume content"
        companyName="Google"
        onCopy={() => {}}
        onDownload={handleDownload}
      />
    )

    await user.click(screen.getByRole('button', { name: /download pdf/i }))
    expect(handleDownload).toHaveBeenCalledTimes(1)
  })

  it('should show copied feedback after copy', async () => {
    const user = userEvent.setup()

    render(
      <ResumeOutput
        content="Resume content"
        companyName="Google"
        onCopy={() => {}}
        onDownload={() => {}}
        copied={true}
      />
    )

    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument()
  })
})
