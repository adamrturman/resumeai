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
You are a resume customization assistant. Your task is to customize a resume for a specific job description.

CRITICAL INSTRUCTIONS - ANTI-HALLUCINATION:
- ONLY use skills from the provided list below. Do NOT invent or add any skills not in this list.
- ONLY use bullet points from the provided experience. Do NOT create new achievements or experiences.
- Select the most relevant skills and customize bullet point emphasis based on the job requirements.

JOB DESCRIPTION:
${jobDescription}

AVAILABLE SKILLS (select only from this list):
${skillsList}

AVAILABLE BULLET POINTS BY ROLE:
${bulletPointsList.join('\n')}

RESUME TO CUSTOMIZE:
Name: ${resume.contact.name}
Email: ${resume.contact.email}
LinkedIn: ${resume.contact.linkedin}

Current Skills: ${resume.technicalSkills.map((s) => s.name).join(', ')}

TASK:
1. Extract the company name from the job description
2. Select the most relevant skills from the AVAILABLE SKILLS list for this job (8-12 skills)
3. Choose the most relevant bullet points for each role to emphasize relevant experience
4. Return ONLY valid JSON in this exact format, no markdown or explanation:

{
  "companyName": "Company Name",
  "technicalSkills": ["Skill1", "Skill2", ...],
  "bullets": {
    "seniorEngineer": ["bullet1", "bullet2", ...],
    "engineerII": ["bullet1", "bullet2", ...],
    "engineerI": ["bullet1", "bullet2"],
    "frontendEngineer": ["bullet1", "bullet2"],
    "developerSupport": ["bullet1"]
  }
}

Remember:
- Do NOT add any skills or bullet points not provided above
- Select bullet points that best match the job requirements
- Include 2-4 bullets for Senior Engineer and Engineer II, 1-2 for other roles
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
