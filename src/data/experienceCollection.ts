import type { ExperienceCollection, Skill } from './types'

export const allSkills: Skill[] = [
  { name: 'JavaScript (ES6+)', category: 'language' },
  { name: 'TypeScript', category: 'language' },
  { name: 'React', category: 'framework' },
  { name: 'Python', category: 'language' },
  { name: 'Git', category: 'tool' },
  { name: 'Jest', category: 'tool' },
  { name: 'CI/CD', category: 'concept' },
  { name: 'Vite', category: 'tool' },
  { name: 'RESTful APIs', category: 'concept' },
  { name: 'HTML5', category: 'language' },
  { name: 'CSS3', category: 'language' },
  { name: 'Agile/Scrum', category: 'concept' },
  { name: 'Vitest', category: 'tool' },
  { name: 'Playwright', category: 'tool' },
  { name: 'GitHub Actions', category: 'tool' },
]

export const allBulletPoints: Map<string, string[]> = new Map([
  [
    'Senior Software Engineer',
    [
      'Built reusable React/TypeScript component library for AI chat applications, standardizing UI patterns for message rendering, conversation history searching, and responsive designs across multiple AI-powered applications',
      'Designed a comprehensive LLM evaluation framework in Python for blockchain classification tasks, implementing automated pipelines for synthetic data generation, quality filtering, performance analysis, and data visualization.',
      'Redesigned GitHub Actions workflows to parallelize Vitest unit tests and Playwright browser tests, achieving a 67% reduction in CI/CD pipeline time (15 minutes to 5 minutes) and enabling faster iteration cycles for the engineering team.',
    ],
  ],
  [
    'Software Engineer II',
    [
      'Promoted to Senior Software Engineer after 11 months due to high performance & technical leadership.',
      'Selected as technical lead for a 3-month cross-chain bridge project, authoring the technical specification and leading a team of two engineers to successful delivery.',
      'Implemented user-friendly frontend interfaces for cross-chain bridging, staking, and automated rewards reinvestment, reducing complex workflows from multi-step processes to single-click operations and improving user adoption.',
      'Provided mentorship & technical guidance to new team members & managers.',
    ],
  ],
  [
    'Software Engineer I',
    [
      'Promoted to Software Engineer II after 11 months of consistently exceeding expectations.',
      'Demonstrated technical expertise as the only non-senior engineer invited to lead sprint planning & participate in hiring interviews for software engineering roles.',
    ],
  ],
  [
    'Frontend Engineer',
    [
      'Promoted to Software Engineer I after nine months of outstanding performance.',
      'Collaborated with a remote, cross-functional team to deliver tested, scalable features',
    ],
  ],
  [
    'Developer Support Engineer',
    [
      'Promoted to Frontend Engineer after seven months of successfully solving user & customer inquiries.',
    ],
  ],
])

export const experienceCollection: ExperienceCollection = {
  allSkills,
  allBulletPoints,
}
