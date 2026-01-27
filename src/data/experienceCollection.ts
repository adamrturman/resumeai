import type { ExperienceCollection } from './types'

export const experienceCollection: ExperienceCollection = {
  skills: [
    { name: 'TypeScript', category: 'technical', proficiency: 'expert' },
    { name: 'JavaScript', category: 'technical', proficiency: 'expert' },
    { name: 'React', category: 'technical', proficiency: 'expert' },
    { name: 'Node.js', category: 'technical', proficiency: 'advanced' },
    { name: 'Python', category: 'technical', proficiency: 'advanced' },
    { name: 'PostgreSQL', category: 'technical', proficiency: 'advanced' },
    { name: 'MongoDB', category: 'technical', proficiency: 'intermediate' },
    { name: 'AWS', category: 'technical', proficiency: 'advanced' },
    { name: 'Docker', category: 'tool', proficiency: 'advanced' },
    { name: 'Git', category: 'tool', proficiency: 'expert' },
    { name: 'CI/CD', category: 'tool', proficiency: 'advanced' },
    { name: 'REST APIs', category: 'technical', proficiency: 'expert' },
    { name: 'GraphQL', category: 'technical', proficiency: 'intermediate' },
    { name: 'Agile/Scrum', category: 'soft', proficiency: 'advanced' },
    { name: 'Team Leadership', category: 'soft', proficiency: 'advanced' },
    {
      name: 'Technical Writing',
      category: 'soft',
      proficiency: 'intermediate',
    },
  ],
  volunteerWork: [
    {
      company: 'Code for Good',
      title: 'Volunteer Developer',
      location: 'Remote',
      startDate: 'Jan 2021',
      endDate: 'Present',
      highlights: [
        'Built web applications for local nonprofits',
        'Mentored aspiring developers from underrepresented communities',
      ],
    },
  ],
}
