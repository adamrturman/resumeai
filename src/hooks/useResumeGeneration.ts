import { useState, useCallback } from 'react'
import { getAIProvider } from '../services/ai'
import {
  buildResumePrompt,
  extractCompanyName,
} from '../services/resume/promptBuilder'
import { baseResume } from '../data/baseResume'
import { experienceCollection } from '../data/experienceCollection'

interface UseResumeGenerationReturn {
  resume: string | null
  companyName: string
  loading: boolean
  error: string | null
  generate: (jobDescription: string) => Promise<void>
  reset: () => void
}

export function useResumeGeneration(): UseResumeGenerationReturn {
  const [resume, setResume] = useState<string | null>(null)
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
      setCompanyName(extractCompanyName(jobDescription))
    } catch {
      setError('Failed to generate resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResume(null)
    setCompanyName('')
    setError(null)
  }, [])

  return {
    resume,
    companyName,
    loading,
    error,
    generate,
    reset,
  }
}
