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
    { name: 'Jest', category: 'tool' },
    { name: 'CI/CD', category: 'concept' },
    { name: 'Vite', category: 'tool' },
    { name: 'RESTful APIs', category: 'concept' },
  ],
  workExperience: [
    {
      company: 'Kava Labs',
      title: 'Senior Software Engineer',
      startDate: 'April 2024',
      endDate: 'August 2025',
      highlights: [
        'Design and build scalable, production-grade frontend applications using React and TypeScript, with a strong focus on performance, accessibility, and maintainable architecture',
        'Led improvements to the CI/CD pipeline, parallelizing unit and integration tests and reducing build times by 67% (15 → 5 minutes) using modern automation practices',
        'Analyze large datasets and application behavior to identify system-level issues, inform technical decisions, and improve platform reliability',
        'Participate in code reviews, architectural discussions, and platform-level improvements to raise engineering standards',
      ],
    },
    {
      company: 'Kava Labs',
      title: 'Software Engineer II',
      startDate: 'May 2023',
      endDate: 'March 2024',
      highlights: [
        'Delivered frontend-focused solutions across the full software development lifecycle, from technical design through development, testing, and production support',
        'Served as technical lead on a 3-month initiative, authoring technical specifications, coordinating with stakeholders, and guiding two engineers through agile sprints to successful delivery',
        'Contributed to shared frontend patterns and best practices to support scalable feature development',
      ],
    },
    {
      company: 'Kava Labs',
      title: 'Software Engineer I',
      startDate: 'June 2022',
      endDate: 'May 2023',
      highlights: [
        'Promoted to Software Engineer II after 11 months of consistently exceeding expectations',
        'Developed, debugged, and maintained code in a fast-paced environment using modern programming languages and agile methodologies',
      ],
    },
    {
      company: 'Kava Labs',
      title: 'Frontend Engineer',
      startDate: 'September 2021',
      endDate: 'June 2022',
      highlights: [
        'Promoted to Software Engineer I after nine months of outstanding performance',
        'Collaborated cross-functionally with product managers and designers to translate user needs into intuitive, responsive UI implementations',
      ],
    },
    {
      company: 'Kava Labs',
      title: 'Developer Support Engineer',
      startDate: 'February 2021',
      endDate: 'September 2021',
      highlights: [
        'Promoted to Frontend Engineer after seven months of successfully solving user issues',
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
