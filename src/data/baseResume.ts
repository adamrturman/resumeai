import type { BaseResume } from './types'

export const baseResume: BaseResume = {
  contact: {
    name: 'Adam Turman',
    email: 'adam.turman@example.com',
    phone: '(555) 123-4567',
    location: 'City, State',
    linkedin: 'linkedin.com/in/adamturman',
    github: 'github.com/adamturman',
  },
  summary:
    'Experienced software engineer with a passion for building scalable applications and solving complex problems. Skilled in full-stack development with a focus on modern web technologies.',
  education: [
    {
      institution: 'University Name',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      graduationDate: 'May 2020',
      gpa: '3.8',
      honors: ["Dean's List", 'Cum Laude'],
    },
  ],
  workExperience: [
    {
      company: 'Tech Company Inc.',
      title: 'Senior Software Engineer',
      location: 'City, State',
      startDate: 'Jan 2022',
      endDate: 'Present',
      highlights: [
        'Led development of microservices architecture serving 1M+ daily users',
        'Mentored junior developers and conducted code reviews',
        'Reduced API response time by 40% through optimization',
      ],
    },
    {
      company: 'Startup LLC',
      title: 'Software Engineer',
      location: 'City, State',
      startDate: 'Jun 2020',
      endDate: 'Dec 2021',
      highlights: [
        'Built React-based dashboard for real-time analytics',
        'Implemented CI/CD pipeline reducing deployment time by 60%',
        'Collaborated with product team on feature specifications',
      ],
    },
  ],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: 'Mar 2023',
      expirationDate: 'Mar 2026',
      credentialId: 'ABC123XYZ',
    },
  ],
}
