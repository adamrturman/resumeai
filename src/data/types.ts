export interface ContactInfo {
  name: string
  email: string
  linkedin: string
}

export interface WorkExperience {
  company: string
  title: string
  startDate: string
  endDate: string
  highlights: string[]
}

export interface TechnicalTraining {
  institution: string
  program: string
  dates: string
}

export interface NonTechnicalWorkExperience {
  title: string
  organization: string
  location: string
  dates: string
}

export interface Education {
  institution: string
  degree: string
  year: string
}

export interface Skill {
  name: string
  category: 'language' | 'framework' | 'tool' | 'concept'
}

export interface BaseResume {
  contact: ContactInfo
  technicalSkills: Skill[]
  workExperience: WorkExperience[]
  technicalTraining: TechnicalTraining[]
  nonTechnicalWorkExperience: NonTechnicalWorkExperience[]
  education: Education[]
}

export interface ExperienceCollection {
  allSkills: Skill[]
  allBulletPoints: Map<string, string[]>
}

export interface GeneratedResume {
  contact: ContactInfo
  selectedSkills: Skill[]
  workExperience: WorkExperience[]
  technicalTraining: TechnicalTraining[]
  nonTechnicalWorkExperience: NonTechnicalWorkExperience[]
  education: Education[]
  targetCompany: string
  targetRole: string
}
