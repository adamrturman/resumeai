import type { BaseResume, ExperienceCollection } from '../../data/types'

export function buildResumePrompt(
  jobDescription: string,
  resume: BaseResume,
  experience: ExperienceCollection
): string {
  const skillsList = experience.allSkills.map((s) => s.name).join(', ')

  const bulletPointsList: string[] = []
  experience.allBulletPoints.forEach((bullets, title) => {
    bulletPointsList.push(`${title}:`)
    bullets.forEach((bullet) => bulletPointsList.push(`  - ${bullet}`))
  })

  return `
You are a resume customization assistant. Your task is to tailor a resume for a specific job description by rewording bullet points to emphasize relevant experience.

CRITICAL RULES - DO NOT VIOLATE:
1. ONLY use skills from the AVAILABLE SKILLS list below. Never invent skills I don't have.
2. ONLY use experiences from the AVAILABLE BULLET POINTS below. Never invent achievements or experiences.
3. You may REWORD bullet points to emphasize aspects relevant to the job, but the core facts must remain true.
4. Include ALL bullet points for each role - do not omit any. The output should have the same number of bullets as the input.

JOB DESCRIPTION:
${jobDescription}

AVAILABLE SKILLS (select 8-12 from this list, prioritizing those relevant to the job):
${skillsList}

AVAILABLE BULLET POINTS BY ROLE (reword these to emphasize job-relevant aspects):
${bulletPointsList.join('\n')}

TASK:
1. Extract the company name from the job description
2. Select 8-12 skills from AVAILABLE SKILLS that best match the job requirements
3. Reword EACH bullet point to emphasize aspects most relevant to this job:
   - Keep the same core achievement/fact
   - Adjust emphasis, keywords, and phrasing to align with job requirements
   - Maintain similar length to the original bullet
   - Include ALL bullets for each role (Senior Engineer: 3, Engineer II: 4, Engineer I: 2, Frontend Engineer: 2, Developer Support: 1)

Return ONLY valid JSON in this exact format, no markdown or explanation:

{
  "companyName": "Company Name",
  "technicalSkills": ["Skill1", "Skill2", ...],
  "bullets": {
    "seniorEngineer": ["bullet1", "bullet2", "bullet3"],
    "engineerII": ["bullet1", "bullet2", "bullet3", "bullet4"],
    "engineerI": ["bullet1", "bullet2"],
    "frontendEngineer": ["bullet1", "bullet2"],
    "developerSupport": ["bullet1"]
  }
}
`.trim()
}

export function extractCompanyName(jobDescription: string): string {
  const patterns = [
    /(?:at|@)\s+([A-Z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]+)*)(?:\s+as|\s+for|\s+is|[!.,]|$)/,
    /(?:join|Join)\s+([A-Z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]+)*)(?:\s+as|\s+for|\s+is|[!.,]|$)/i,
    /hiring\s+for\s+([A-Z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]+)*)(?:\s+as|\s+is|[!.,]|$)/i,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Labs|Inc|Corp|LLC|Ltd|Co))/,
  ]

  for (const pattern of patterns) {
    const match = jobDescription.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }

  return 'Company'
}
