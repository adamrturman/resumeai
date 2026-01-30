import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import type { AICompletionResponse } from './services/ai/types'

vi.mock('./services/ai', () => ({
  getAIProvider: vi.fn(),
}))

vi.mock('./services/docx/docxGenerator', () => ({
  generateResume: vi.fn(),
}))

import { getAIProvider } from './services/ai'

const mockResumeResponse = {
  content: 'Generated resume content',
  resumeData: {
    companyName: 'Test Company',
    technicalSkills: ['JavaScript', 'React'],
    usedKeywords: ['JavaScript', 'React'],
    bullets: {
      seniorEngineer: ['Led team projects'],
      engineerII: ['Built features'],
      engineerI: ['Developed code'],
      frontendEngineer: ['Created UI'],
      developerSupport: ['Helped users'],
    },
  },
}

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('loading state', () => {
    it('should show loading skeleton when generating resume', async () => {
      const user = userEvent.setup()
      let resolveGeneration: (value: AICompletionResponse) => void

      const mockProvider = {
        generateCompletion: vi.fn(
          () =>
            new Promise<AICompletionResponse>((resolve) => {
              resolveGeneration = resolve
            })
        ),
      }
      vi.mocked(getAIProvider).mockReturnValue(mockProvider)

      render(<App />)

      const textarea = screen.getByRole('textbox', { name: /job description/i })
      await user.type(textarea, 'Software Engineer at Test Company')

      const generateButton = screen.getByRole('button', {
        name: /generate resume/i,
      })
      await user.click(generateButton)

      expect(screen.getByText(/generating/i)).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /generate resume/i })
      ).toBeDisabled()

      resolveGeneration!(mockResumeResponse)

      await waitFor(() => {
        expect(screen.queryByText(/generating/i)).not.toBeInTheDocument()
      })
    })

    it('should show spinner during loading', async () => {
      const user = userEvent.setup()
      let resolveGeneration: (value: AICompletionResponse) => void

      const mockProvider = {
        generateCompletion: vi.fn(
          () =>
            new Promise<AICompletionResponse>((resolve) => {
              resolveGeneration = resolve
            })
        ),
      }
      vi.mocked(getAIProvider).mockReturnValue(mockProvider)

      const { container } = render(<App />)

      const textarea = screen.getByRole('textbox', { name: /job description/i })
      await user.type(textarea, 'Software Engineer position')

      await user.click(screen.getByRole('button', { name: /generate resume/i }))

      expect(container.querySelector('.spinner')).toBeInTheDocument()

      resolveGeneration!(mockResumeResponse)

      await waitFor(() => {
        expect(container.querySelector('.spinner')).not.toBeInTheDocument()
      })
    })

    it('should display resume content after loading completes', async () => {
      const user = userEvent.setup()

      const mockProvider = {
        generateCompletion: vi.fn().mockResolvedValue(mockResumeResponse),
      }
      vi.mocked(getAIProvider).mockReturnValue(mockProvider)

      render(<App />)

      const textarea = screen.getByRole('textbox', { name: /job description/i })
      await user.type(textarea, 'Software Engineer at Test Company')

      await user.click(screen.getByRole('button', { name: /generate resume/i }))

      await waitFor(() => {
        expect(screen.getByText(/javascript/i)).toBeInTheDocument()
      })

      // Text may be split across spans due to diff highlighting
      const bulletLists = screen.getAllByRole('list')
      const allBulletText = bulletLists
        .map((list) => list.textContent)
        .join(' ')
      expect(allBulletText).toMatch(/led team projects/i)

      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /download resume/i })
      ).toBeInTheDocument()
    })

    it('should keep generate button disabled during loading', async () => {
      const user = userEvent.setup()
      let resolveGeneration: (value: AICompletionResponse) => void

      const mockProvider = {
        generateCompletion: vi.fn(
          () =>
            new Promise<AICompletionResponse>((resolve) => {
              resolveGeneration = resolve
            })
        ),
      }
      vi.mocked(getAIProvider).mockReturnValue(mockProvider)

      render(<App />)

      const textarea = screen.getByRole('textbox', { name: /job description/i })
      await user.type(textarea, 'Software Engineer position')

      const generateButton = screen.getByRole('button', {
        name: /generate resume/i,
      })
      await user.click(generateButton)

      expect(generateButton).toBeDisabled()

      resolveGeneration!(mockResumeResponse)

      await waitFor(() => {
        expect(generateButton).not.toBeDisabled()
      })
    })
  })
})
