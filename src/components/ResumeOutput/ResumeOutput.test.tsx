import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResumeOutput } from './ResumeOutput'
import type { ResumeContent } from '../../services/ai/types'

const mockResumeData: ResumeContent = {
  companyName: 'Google',
  technicalSkills: ['JavaScript', 'TypeScript', 'React'],
  usedKeywords: ['JavaScript', 'TypeScript', 'React'],
  bullets: {
    seniorEngineer: ['Led frontend architecture redesign'],
    engineerII: ['Built scalable APIs'],
    engineerI: ['Developed core features'],
    frontendEngineer: ['Created responsive UI components'],
    developerSupport: ['Resolved customer issues'],
  },
}

describe('ResumeOutput', () => {
  it('should render nothing when no resume content is provided', () => {
    const { container } = render(
      <ResumeOutput
        content={null}
        resumeData={null}
        companyName=""
        onCopy={() => {}}
        onDownload={() => {}}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('should render nothing when no resumeData is provided', () => {
    const { container } = render(
      <ResumeOutput
        content="Some content"
        resumeData={null}
        companyName=""
        onCopy={() => {}}
        onDownload={() => {}}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('should display technical skills when provided', () => {
    render(
      <ResumeOutput
        content="Resume content"
        resumeData={mockResumeData}
        companyName="Google"
        onCopy={() => {}}
        onDownload={() => {}}
      />
    )

    expect(screen.getByText(/javascript/i)).toBeInTheDocument()
    expect(screen.getByText(/typescript/i)).toBeInTheDocument()
  })

  it('should display job section bullets', () => {
    render(
      <ResumeOutput
        content="Resume content"
        resumeData={mockResumeData}
        companyName="Google"
        onCopy={() => {}}
        onDownload={() => {}}
      />
    )

    // Text may be split across spans due to diff highlighting
    const bulletLists = screen.getAllByRole('list')
    const allText = bulletLists.map((list) => list.textContent).join(' ')

    expect(allText).toMatch(/led frontend architecture redesign/i)
    expect(allText).toMatch(/built scalable apis/i)
  })

  it('should have a copy button', () => {
    render(
      <ResumeOutput
        content="Resume content"
        resumeData={mockResumeData}
        companyName="Google"
        onCopy={() => {}}
        onDownload={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
  })

  it('should call onCopy when copy button is clicked', async () => {
    const user = userEvent.setup()
    const handleCopy = vi.fn()

    render(
      <ResumeOutput
        content="Resume content"
        resumeData={mockResumeData}
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
        resumeData={mockResumeData}
        companyName="Google"
        onCopy={() => {}}
        onDownload={() => {}}
      />
    )

    expect(
      screen.getByRole('button', { name: /download resume/i })
    ).toBeInTheDocument()
  })

  it('should call onDownload when download button is clicked', async () => {
    const user = userEvent.setup()
    const handleDownload = vi.fn()

    render(
      <ResumeOutput
        content="Resume content"
        resumeData={mockResumeData}
        companyName="Google"
        onCopy={() => {}}
        onDownload={handleDownload}
      />
    )

    await user.click(screen.getByRole('button', { name: /download resume/i }))
    expect(handleDownload).toHaveBeenCalledTimes(1)
  })

  it('should show copied feedback after copy', () => {
    render(
      <ResumeOutput
        content="Resume content"
        resumeData={mockResumeData}
        companyName="Google"
        onCopy={() => {}}
        onDownload={() => {}}
        copied={true}
      />
    )

    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument()
  })

  describe('loading skeleton', () => {
    it('should show loading skeleton when loading', () => {
      render(
        <ResumeOutput
          content={null}
          resumeData={null}
          companyName=""
          onCopy={() => {}}
          onDownload={() => {}}
          loading={true}
        />
      )

      expect(screen.getByText(/generating/i)).toBeInTheDocument()
    })

    it('should show spinner when loading', () => {
      const { container } = render(
        <ResumeOutput
          content={null}
          resumeData={null}
          companyName=""
          onCopy={() => {}}
          onDownload={() => {}}
          loading={true}
        />
      )

      expect(container.querySelector('.spinner')).toBeInTheDocument()
    })

    it('should show preview header when loading', () => {
      render(
        <ResumeOutput
          content={null}
          resumeData={null}
          companyName=""
          onCopy={() => {}}
          onDownload={() => {}}
          loading={true}
        />
      )

      expect(
        screen.getByRole('heading', { name: /preview of customized sections/i })
      ).toBeInTheDocument()
    })

    it('should not show action buttons when loading', () => {
      render(
        <ResumeOutput
          content={null}
          resumeData={null}
          companyName=""
          onCopy={() => {}}
          onDownload={() => {}}
          loading={true}
        />
      )

      expect(
        screen.queryByRole('button', { name: /copy/i })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /download/i })
      ).not.toBeInTheDocument()
    })

    it('should not show actual content when loading', () => {
      render(
        <ResumeOutput
          content="Resume content"
          resumeData={mockResumeData}
          companyName="Google"
          onCopy={() => {}}
          onDownload={() => {}}
          loading={true}
        />
      )

      expect(screen.queryByText(/javascript/i)).not.toBeInTheDocument()
      expect(
        screen.queryByText(/led frontend architecture/i)
      ).not.toBeInTheDocument()
    })

    it('should show content after loading completes', () => {
      const { rerender } = render(
        <ResumeOutput
          content={null}
          resumeData={null}
          companyName=""
          onCopy={() => {}}
          onDownload={() => {}}
          loading={true}
        />
      )

      expect(screen.getByText(/generating/i)).toBeInTheDocument()

      rerender(
        <ResumeOutput
          content="Resume content"
          resumeData={mockResumeData}
          companyName="Google"
          onCopy={() => {}}
          onDownload={() => {}}
          loading={false}
        />
      )

      expect(screen.queryByText(/generating/i)).not.toBeInTheDocument()
      expect(screen.getByText(/javascript/i)).toBeInTheDocument()
    })
  })
})
