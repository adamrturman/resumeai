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
  { name: 'Node.js', category: 'framework' },
  { name: 'HTML5', category: 'language' },
  { name: 'CSS3', category: 'language' },
  { name: 'PostgreSQL', category: 'tool' },
  { name: 'MongoDB', category: 'tool' },
  { name: 'AWS', category: 'tool' },
  { name: 'Docker', category: 'tool' },
  { name: 'GraphQL', category: 'concept' },
  { name: 'Agile/Scrum', category: 'concept' },
  { name: 'Testing Library', category: 'tool' },
  { name: 'Vitest', category: 'tool' },
]

export const allBulletPoints: Map<string, string[]> = new Map([
  [
    'Senior Software Engineer',
    [
      'Design and build scalable, production-grade frontend applications using React and TypeScript, with a strong focus on performance, accessibility, and maintainable architecture',
      'Led improvements to the CI/CD pipeline, parallelizing unit and integration tests and reducing build times by 67% (15 → 5 minutes) using modern automation practices',
      'Analyze large datasets and application behavior to identify system-level issues, inform technical decisions, and improve platform reliability',
      'Participate in code reviews, architectural discussions, and platform-level improvements to raise engineering standards',
    ],
  ],
  [
    'Software Engineer II',
    [
      'Delivered frontend-focused solutions across the full software development lifecycle, from technical design through development, testing, and production support',
      'Served as technical lead on a 3-month initiative, authoring technical specifications, coordinating with stakeholders, and guiding two engineers through agile sprints to successful delivery',
      'Contributed to shared frontend patterns and best practices to support scalable feature development',
    ],
  ],
  [
    'Software Engineer I',
    [
      'Promoted to Software Engineer II after 11 months of consistently exceeding expectations',
      'Developed, debugged, and maintained code in a fast-paced environment using modern programming languages and agile methodologies',
    ],
  ],
  [
    'Frontend Engineer',
    [
      'Promoted to Software Engineer I after nine months of outstanding performance',
      'Collaborated cross-functionally with product managers and designers to translate user needs into intuitive, responsive UI implementations',
    ],
  ],
  [
    'Developer Support Engineer',
    [
      'Promoted to Frontend Engineer after seven months of successfully solving user issues',
    ],
  ],
])

export const experienceCollection: ExperienceCollection = {
  allSkills,
  allBulletPoints,
}
