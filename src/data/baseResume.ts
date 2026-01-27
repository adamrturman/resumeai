import type { BaseResume } from './types'

export const baseResume: BaseResume = {
  contact: {
    name: 'Adam Turman',
    email: 'adamrturman@gmail.com',
    linkedin: 'linkedin.com/in/adam-r-turman',
  },
  technicalSkills: [
    { name: 'JavaScript (ES6+)', category: 'language' },
    { name: 'TypeScript', category: 'language' },
    { name: 'React', category: 'framework' },
    { name: 'Python', category: 'language' },
    { name: 'Git', category: 'tool' },
  ],
  workExperience: [
    {
      company: 'Kava Labs',
      title: 'Senior Software Engineer',
      startDate: 'April 2024',
      endDate: 'Present',
      highlights: [
        'Built reusable React/TypeScript component library for AI chat applications, standardizing UI patterns for message rendering, conversation history searching, and responsive designs across multiple AI-powered applications',
        'Designed a comprehensive LLM evaluation framework in Python for blockchain classification tasks, implementing automated pipelines for synthetic data generation, quality filtering, performance analysis, and data visualization.',
        'Redesigned GitHub Actions workflows to parallelize Vitest unit tests and Playwright browser tests, achieving a 67% reduction in CI/CD pipeline time (15 minutes to 5 minutes) and enabling faster iteration cycles for the engineering team.',
      ],
    },
    {
      company: 'Kava Labs',
      title: 'Software Engineer II',
      startDate: 'May 2023',
      endDate: 'March 2024',
      highlights: [
        'Promoted to Senior Software Engineer after 11 months due to high performance & technical leadership.',
        'Selected as technical lead for a 3-month cross-chain bridge project, authoring the technical specification and leading a team of two engineers to successful delivery.',
        'Implemented user-friendly frontend interfaces for cross-chain bridging, staking, and automated rewards reinvestment, reducing complex workflows from multi-step processes to single-click operations and improving user adoption.',
        'Provided mentorship & technical guidance to new team members & managers.',
      ],
    },
    {
      company: 'Kava Labs',
      title: 'Software Engineer I',
      startDate: 'June 2022',
      endDate: 'May 2023',
      highlights: [
        'Promoted to Software Engineer II after 11 months of consistently exceeding expectations.',
        'Demonstrated technical expertise as the only non-senior engineer invited to lead sprint planning & participate in hiring interviews for software engineering roles.',
      ],
    },
    {
      company: 'Kava Labs',
      title: 'Frontend Engineer',
      startDate: 'September 2021',
      endDate: 'June 2022',
      highlights: [
        'Promoted to Software Engineer I after nine months of outstanding performance.',
        'Collaborated with a remote, cross-functional team to deliver tested, scalable features',
      ],
    },
    {
      company: 'Kava Labs',
      title: 'Developer Support Engineer',
      startDate: 'February 2021',
      endDate: 'September 2021',
      highlights: [
        'Promoted to Frontend Engineer after seven months of successfully solving user & customer inquiries.',
      ],
    },
  ],
  technicalTraining: [
    {
      institution: 'General Assembly',
      program: 'Software Engineering Bootcamp Certificate',
      dates: 'June 2020 – September 2020',
    },
  ],
  nonTechnicalWorkExperience: [
    {
      title: 'Teacher & Department Chair',
      organization: 'Crown Point Community Schools',
      location: 'Indiana',
      dates: 'August 2016 – June 2020',
    },
    {
      title: 'Teacher',
      organization: 'School City of Hammond',
      location: 'Indiana',
      dates: 'August 2015 – August 2016',
    },
  ],
  education: [
    {
      institution: 'DePaul University',
      degree: 'Master of Music',
      year: '2013',
    },
    {
      institution: 'Indiana University',
      degree: 'Bachelor of Music',
      year: '2011',
    },
  ],
}
