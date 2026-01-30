import type {
  AIProvider,
  AICompletionRequest,
  AICompletionResponse,
  ResumeContent,
} from './types'

export interface MockProviderOptions {
  delayMs?: number
}

const MOCK_RESUME_DATA: ResumeContent = {
  companyName: 'Acme Corp',
  technicalSkills: [
    'JavaScript (ES6+)',
    'TypeScript',
    'React',
    'Python',
    'Git',
    'Jest',
    'CI/CD',
    'Vite',
    'RESTful APIs',
  ],
  usedKeywords: ['React', 'TypeScript', 'CI/CD', 'scalable', 'agile'],
  bullets: {
    seniorEngineer: [
      'Design and build scalable, production-grade frontend applications using React and TypeScript, with a strong focus on performance, accessibility, and maintainable architecture',
      'Led improvements to the CI/CD pipeline, parallelizing unit and integration tests and reducing build times by 67% (15 → 5 minutes) using modern automation practices',
      'Analyze large datasets and application behavior to identify system-level issues, inform technical decisions, and improve platform reliability',
      'Participate in code reviews, architectural discussions, and platform-level improvements to raise engineering standards',
    ],
    engineerII: [
      'Delivered frontend-focused solutions across the full software development lifecycle, from technical design through development, testing, and production support',
      'Served as technical lead on a 3-month initiative, authoring technical specifications, coordinating with stakeholders, and guiding two engineers through agile sprints to successful delivery',
      'Contributed to shared frontend patterns and best practices to support scalable feature development',
    ],
    engineerI: [
      'Promoted to Software Engineer II after 11 months of consistently exceeding expectations',
      'Developed, debugged, and maintained code in a fast-paced environment using modern programming languages and agile methodologies',
    ],
    frontendEngineer: [
      'Promoted to Software Engineer I after nine months of outstanding performance',
      'Collaborated cross-functionally with product managers and designers to translate user needs into intuitive, responsive UI implementations',
    ],
    developerSupport: [
      'Promoted to Frontend Engineer after seven months of successfully solving user issues',
    ],
  },
}

function formatResumeAsText(data: ResumeContent): string {
  return `Adam Turman
adamrturman@gmail.com
linkedin.com/in/adam-r-turman

Technical skills: ${data.technicalSkills.join(', ')}

Work Experience

Kava Labs

Senior Software Engineer, April 2024 – Present
${data.bullets.seniorEngineer.map((b) => `● ${b}`).join('\n')}

Software Engineer II, May 2023 – March 2024
${data.bullets.engineerII.map((b) => `● ${b}`).join('\n')}

Software Engineer I, June 2022 – May 2023
${data.bullets.engineerI.map((b) => `● ${b}`).join('\n')}

Frontend Engineer, September 2021 – June 2022
${data.bullets.frontendEngineer.map((b) => `● ${b}`).join('\n')}

Developer Support Engineer, February 2021 – September 2021
${data.bullets.developerSupport.map((b) => `● ${b}`).join('\n')}

Technical Training

General Assembly, Software Engineering Bootcamp Certificate, June 2020 – September 2020

Non-technical Work Experience

Teacher & Department Chair- Crown Point Community Schools (Indiana), August 2016 – June 2020
Teacher - School City of Hammond (Indiana), August 2015 – August 2016

Formal Education

DePaul University, Master of Music, 2013
Indiana University, Bachelor of Music, 2011`
}

export class MockProvider implements AIProvider {
  private delayMs: number

  constructor(options: MockProviderOptions = {}) {
    this.delayMs = options.delayMs ?? 1000
  }

  async generateCompletion(
    request: AICompletionRequest
  ): Promise<AICompletionResponse> {
    await this.simulateDelay()

    const resumeData = { ...MOCK_RESUME_DATA }

    // In mock, just use default company. Real LLM will extract from job description.
    resumeData.companyName = 'Acme Corp'

    const content = formatResumeAsText(resumeData)
    const promptTokens = Math.ceil(request.prompt.length / 4)
    const completionTokens = Math.ceil(content.length / 4)

    return {
      content,
      resumeData,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
      },
    }
  }

  private simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.delayMs))
  }
}
