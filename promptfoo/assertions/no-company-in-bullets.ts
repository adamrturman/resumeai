import { AssertionResult } from './types'
import { extractJson, createFailure, matchesWordBoundary } from './utils'

function noCompanyInBullets(output: string): AssertionResult {
  const data = extractJson(output)
  if (!data) {
    return createFailure('Could not extract valid JSON from output')
  }

  const companyName = data.companyName

  if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
    return true
  }

  const bullets = data.bullets || {}
  const allBulletText = Object.values(bullets).flat().join(' ')

  if (matchesWordBoundary(allBulletText, companyName.trim())) {
    return createFailure(
      `Company name "${companyName}" should not appear in bullet points`
    )
  }

  return true
}

export default noCompanyInBullets
