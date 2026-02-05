import { AssertionFailure, ResumeOutput } from './types'

export function extractJson(output: string): ResumeOutput | null {
  try {
    return JSON.parse(output)
  } catch {
    const match = output.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch {
        return null
      }
    }
    return null
  }
}

export function createFailure(reason: string): AssertionFailure {
  return {
    pass: false,
    score: 0,
    reason,
  }
}

export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function matchesWordBoundary(text: string, term: string): boolean {
  const regex = new RegExp(`\\b${escapeRegex(term)}\\b`, 'i')
  return regex.test(text)
}
