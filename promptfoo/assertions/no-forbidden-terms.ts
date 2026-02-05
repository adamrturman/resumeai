import * as fs from 'fs'
import * as path from 'path'
import { AssertionResult } from './types'
import { extractJson, createFailure, matchesWordBoundary } from './utils'

function loadForbiddenTerms(): string[] {
  const termsFile = path.join(process.cwd(), 'promptfoo', 'forbidden-terms.txt')
  const termsContent = fs.readFileSync(termsFile, 'utf-8')
  return termsContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((term) => term.toLowerCase())
}

function noForbiddenTerms(output: string): AssertionResult {
  const data = extractJson(output)
  if (!data) {
    return createFailure('Could not extract valid JSON from output')
  }

  const bullets = data.bullets || {}
  const allBulletText = Object.values(bullets).flat().join(' ').toLowerCase()

  const forbiddenTerms = loadForbiddenTerms()

  const found = forbiddenTerms.filter((term) =>
    matchesWordBoundary(allBulletText, term)
  )

  if (found.length > 0) {
    return createFailure(`Found forbidden terms: ${found.join(', ')}`)
  }

  return true
}

export default noForbiddenTerms
export { loadForbiddenTerms }
