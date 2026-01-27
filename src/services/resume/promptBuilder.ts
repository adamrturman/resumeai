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
1. Select the most relevant skills from the AVAILABLE SKILLS list for this job
2. Choose and potentially reorder bullet points to emphasize relevant experience
3. Return a customized resume that highlights the candidate's fit for this role

Remember: Do NOT add any skills or experiences not provided above.
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
