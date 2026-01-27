import { describe, it, expect } from 'vitest'
import { buildResumePrompt, extractCompanyName } from '../promptBuilder'
import { baseResume } from '../../../data/baseResume'
import { experienceCollection } from '../../../data/experienceCollection'

describe('promptBuilder', () => {
  describe('buildResumePrompt', () => {
    it('should include job description in the prompt', () => {
      const jobDescription =
        'We are looking for a React developer with TypeScript experience.'
      const prompt = buildResumePrompt(
        jobDescription,
        baseResume,
        experienceCollection
      )

      expect(prompt).toContain(jobDescription)
    })

    it('should include anti-hallucination instruction', () => {
      const jobDescription = 'Software engineer position'
      const prompt = buildResumePrompt(
        jobDescription,
        baseResume,
        experienceCollection
      )

      expect(prompt.toLowerCase()).toContain('only use skills')
      expect(prompt.toLowerCase()).toContain('do not invent')
    })

    it('should include available skills from experience collection', () => {
      const jobDescription = 'Looking for React developer'
      const prompt = buildResumePrompt(
        jobDescription,
        baseResume,
        experienceCollection
      )

      expect(prompt).toContain('TypeScript')
      expect(prompt).toContain('React')
    })

    it('should include work experience bullet points', () => {
      const jobDescription = 'Senior engineer role'
      const prompt = buildResumePrompt(
        jobDescription,
        baseResume,
        experienceCollection
      )

      expect(prompt).toContain('CI/CD pipeline')
    })

    it('should ask AI to select relevant skills from provided list', () => {
      const jobDescription = 'Python backend developer'
      const prompt = buildResumePrompt(
        jobDescription,
        baseResume,
        experienceCollection
      )

      expect(prompt.toLowerCase()).toContain('select')
      expect(prompt.toLowerCase()).toContain('relevant')
    })

    it('should ask AI to customize bullet points', () => {
      const jobDescription = 'Frontend position'
      const prompt = buildResumePrompt(
        jobDescription,
        baseResume,
        experienceCollection
      )

      expect(prompt.toLowerCase()).toContain('bullet')
    })
  })

  describe('extractCompanyName', () => {
    it('should extract company name from job description', () => {
      const jobDescription = 'Join Google as a software engineer!'
      const company = extractCompanyName(jobDescription)

      expect(company).toBe('Google')
    })

    it('should extract company name after "at" keyword', () => {
      const jobDescription = 'Software Engineer at Microsoft'
      const company = extractCompanyName(jobDescription)

      expect(company).toBe('Microsoft')
    })

    it('should extract company name after "for" keyword', () => {
      const jobDescription = 'We are hiring for Amazon Web Services'
      const company = extractCompanyName(jobDescription)

      expect(company).toBe('Amazon Web Services')
    })

    it('should return "Company" as fallback when no company found', () => {
      const jobDescription = 'Looking for talented engineers'
      const company = extractCompanyName(jobDescription)

      expect(company).toBe('Company')
    })

    it('should handle company names with common patterns', () => {
      const jobDescription = 'Join our team at Kava Labs!'
      const company = extractCompanyName(jobDescription)

      expect(company).toBe('Kava Labs')
    })
  })
})
