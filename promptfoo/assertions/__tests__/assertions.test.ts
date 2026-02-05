import { describe, it, expect } from 'vitest'
import noCompanyInBullets from '../no-company-in-bullets'
import * as utils from '../utils'

describe('utils', () => {
  describe('extractJson', () => {
    it('parses valid JSON directly', () => {
      const json = '{"companyName": "Acme"}'
      expect(utils.extractJson(json)).toEqual({ companyName: 'Acme' })
    })

    it('extracts JSON from text with surrounding content', () => {
      const output = 'Here is the result: {"companyName": "Acme"} Done!'
      expect(utils.extractJson(output)).toEqual({ companyName: 'Acme' })
    })

    it('returns null for invalid JSON', () => {
      expect(utils.extractJson('not json at all')).toBeNull()
    })

    it('returns null for malformed JSON', () => {
      expect(utils.extractJson('{invalid: json}')).toBeNull()
    })
  })

  describe('createFailure', () => {
    it('creates a failure object with the given reason', () => {
      expect(utils.createFailure('test reason')).toEqual({
        pass: false,
        score: 0,
        reason: 'test reason',
      })
    })
  })

  describe('escapeRegex', () => {
    it('escapes special regex characters', () => {
      expect(utils.escapeRegex('C++')).toBe('C\\+\\+')
      expect(utils.escapeRegex('file.txt')).toBe('file\\.txt')
      expect(utils.escapeRegex('(test)')).toBe('\\(test\\)')
    })

    it('leaves normal characters unchanged', () => {
      expect(utils.escapeRegex('React')).toBe('React')
    })
  })

  describe('matchesWordBoundary', () => {
    it('matches whole words', () => {
      expect(utils.matchesWordBoundary('I know React well', 'React')).toBe(true)
    })

    it('does not match partial words', () => {
      expect(utils.matchesWordBoundary('scalable system', 'scala')).toBe(false)
    })

    it('is case insensitive', () => {
      expect(utils.matchesWordBoundary('I know REACT well', 'react')).toBe(true)
    })

    it('matches at beginning of string', () => {
      expect(utils.matchesWordBoundary('React is great', 'React')).toBe(true)
    })

    it('matches at end of string', () => {
      expect(utils.matchesWordBoundary('I love React', 'React')).toBe(true)
    })

    it('matches hyphenated terms', () => {
      expect(
        utils.matchesWordBoundary('Using front-end tools', 'front-end')
      ).toBe(true)
    })
  })
})

describe('noCompanyInBullets', () => {
  it('returns failure when JSON is invalid', () => {
    const result = noCompanyInBullets('invalid json')
    expect(result).toEqual({
      pass: false,
      score: 0,
      reason: 'Could not extract valid JSON from output',
    })
  })

  it('passes when company name is not in bullets', () => {
    const output = JSON.stringify({
      companyName: 'Acme Corp',
      bullets: {
        job1: ['Built a scalable system', 'Led a team of 5'],
      },
    })
    expect(noCompanyInBullets(output)).toBe(true)
  })

  it('fails when company name appears in bullets', () => {
    const output = JSON.stringify({
      companyName: 'Acme Corp',
      bullets: {
        job1: ['Built a system for Acme Corp', 'Led a team of 5'],
      },
    })
    const result = noCompanyInBullets(output)
    expect(result).toEqual({
      pass: false,
      score: 0,
      reason: 'Company name "Acme Corp" should not appear in bullet points',
    })
  })

  it('passes when company name is empty', () => {
    const output = JSON.stringify({
      companyName: '',
      bullets: { job1: ['Did some work'] },
    })
    expect(noCompanyInBullets(output)).toBe(true)
  })

  it('passes when company name is missing', () => {
    const output = JSON.stringify({
      bullets: { job1: ['Did some work'] },
    })
    expect(noCompanyInBullets(output)).toBe(true)
  })

  it('handles JSON with surrounding text', () => {
    const output = `Here is the resume: {"companyName": "Acme", "bullets": {"job1": ["Did work"]}} end`
    expect(noCompanyInBullets(output)).toBe(true)
  })

  it('is case insensitive when matching company name', () => {
    const output = JSON.stringify({
      companyName: 'Acme Corp',
      bullets: {
        job1: ['Built a system for ACME CORP'],
      },
    })
    const result = noCompanyInBullets(output)
    expect(result).toHaveProperty('pass', false)
  })

  it('passes when company name is whitespace only', () => {
    const output = JSON.stringify({
      companyName: '   ',
      bullets: { job1: ['Did some work'] },
    })
    expect(noCompanyInBullets(output)).toBe(true)
  })

  it('checks across multiple jobs', () => {
    const output = JSON.stringify({
      companyName: 'Acme',
      bullets: {
        job1: ['Built features'],
        job2: ['Worked at Acme headquarters'],
      },
    })
    const result = noCompanyInBullets(output)
    expect(result).toHaveProperty('pass', false)
  })
})
