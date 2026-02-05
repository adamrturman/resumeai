import * as fs from 'fs'
import * as path from 'path'
import { AssertionResult, AssertionContext } from './types'
import { extractJson, createFailure, matchesWordBoundary } from './utils'

function extractSkillsFromBaseResume(): string[] {
  const resumeFile = path.join(process.cwd(), 'src', 'data', 'baseResume.ts')
  const content = fs.readFileSync(resumeFile, 'utf-8')

  const skillMatches = content.match(/{\s*name:\s*['"]([^'"]+)['"]/g) || []

  return skillMatches
    .map((match) => {
      const nameMatch = match.match(/name:\s*['"]([^'"]+)['"]/)
      return nameMatch ? nameMatch[1].toLowerCase() : null
    })
    .filter((skill): skill is string => skill !== null)
}

function requiredTermsPresent(
  output: string,
  context: AssertionContext
): AssertionResult {
  const data = extractJson(output)
  if (!data) {
    return createFailure('Could not extract valid JSON from output')
  }

  const bullets = data.bullets || {}
  const allBulletText = Object.values(bullets).flat().join(' ').toLowerCase()

  const baseResumeTerms = extractSkillsFromBaseResume()

  const jobDescription = (context.vars?.jobDescription || '').toLowerCase()

  const termsInJobDescription = baseResumeTerms.filter((term) =>
    matchesWordBoundary(jobDescription, term)
  )

  if (termsInJobDescription.length === 0) {
    return true
  }

  const missingTerms = termsInJobDescription.filter(
    (term) => !matchesWordBoundary(allBulletText, term)
  )

  if (missingTerms.length > 0) {
    return createFailure(
      `Job description mentions these skills from your resume, but they're missing from bullets: ${missingTerms.join(', ')}`
    )
  }

  return true
}

export default requiredTermsPresent
export { extractSkillsFromBaseResume }
