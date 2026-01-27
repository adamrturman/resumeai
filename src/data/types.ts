export interface ContactInfo {
  name: string
  email: string
  phone: string
  location: string
  linkedin?: string
  github?: string
}

export interface Education {
  institution: string
  degree: string
  field: string
  graduationDate: string
  gpa?: string
  honors?: string[]
}

export interface WorkExperience {
  company: string
  title: string
  location: string
  startDate: string
  endDate: string
  highlights: string[]
}

export interface Certification {
  name: string
  issuer: string
  date: string
  expirationDate?: string
  credentialId?: string
}

export interface Skill {
  name: string
  category: 'technical' | 'soft' | 'language' | 'tool'
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface BaseResume {
  contact: ContactInfo
  summary: string
  education: Education[]
  workExperience: WorkExperience[]
  certifications: Certification[]
}

export interface ExperienceCollection {
  skills: Skill[]
  volunteerWork?: WorkExperience[]
}

export interface GeneratedResume extends BaseResume {
  targetCompany: string
  targetRole: string
  selectedSkills: Skill[]
}
