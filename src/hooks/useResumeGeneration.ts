import { useState, useCallback } from 'react'
import { getAIProvider } from '../services/ai'
import type { ResumeContent } from '../services/ai/types'
import {
  buildResumePrompt,
  extractCompanyName,
} from '../services/resume/promptBuilder'
import { baseResume } from '../data/baseResume'
import { experienceCollection } from '../data/experienceCollection'

interface UseResumeGenerationReturn {
  resume: string | null
  resumeData: ResumeContent | null
  companyName: string
  loading: boolean
  error: string | null
  generate: (jobDescription: string) => Promise<void>
  reset: () => void
}

export function useResumeGeneration(): UseResumeGenerationReturn {
  const [resume, setResume] = useState<string | null>(null)
  const [resumeData, setResumeData] = useState<ResumeContent | null>(null)
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (jobDescription: string) => {
    setLoading(true)
    setError(null)

    try {
      const provider = getAIProvider()
      const prompt = buildResumePrompt(
        jobDescription,
        baseResume,
        experienceCollection
      )
      const response = await provider.generateCompletion({ prompt })

      setResume(response.content)
      setResumeData(response.resumeData ?? null)

      // Use company name from AI response, or extract from job description
      const company =
        response.resumeData?.companyName || extractCompanyName(jobDescription)
      setCompanyName(company)
    } catch {
      setError('Failed to generate resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResume(null)
    setResumeData(null)
    setCompanyName('')
    setError(null)
  }, [])

  return {
    resume,
    resumeData,
    companyName,
    loading,
    error,
    generate,
    reset,
  }
}
