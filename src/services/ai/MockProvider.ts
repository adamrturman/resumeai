import type {
  AIProvider,
  AICompletionRequest,
  AICompletionResponse,
} from './types'

export interface MockProviderOptions {
  delayMs?: number
}

const MOCK_RESUME_CONTENT = `Adam Turman
adamrturman@gmail.com
linkedin.com/in/adam-r-turman

Technical skills: JavaScript (ES6+), TypeScript, React, Python, Git, Jest, CI/CD, Vite, RESTful APIs

Work Experience

Kava Labs

Senior Software Engineer, April 2024 – Present
● Built reusable React/TypeScript component library for AI chat applications, standardizing UI patterns for message rendering, conversation history searching, and responsive designs across multiple AI-powered applications
● Designed a comprehensive LLM evaluation framework in Python for blockchain classification tasks, implementing automated pipelines for synthetic data generation, quality filtering, performance analysis, and data visualization.
● Redesigned GitHub Actions workflows to parallelize Vitest unit tests and Playwright browser tests, achieving a 67% reduction in CI/CD pipeline time (15 minutes to 5 minutes) and enabling faster iteration cycles for the engineering team.

Software Engineer II, May 2023 – March 2024
● Promoted to Senior Software Engineer after 11 months due to high performance & technical leadership.
● Selected as technical lead for a 3-month cross-chain bridge project, authoring the technical specification and leading a team of two engineers to successful delivery.
● Implemented user-friendly frontend interfaces for cross-chain bridging, staking, and automated rewards reinvestment, reducing complex workflows from multi-step processes to single-click operations and improving user adoption.
● Provided mentorship & technical guidance to new team members & managers.

Software Engineer I, June 2022 – May 2023
● Promoted to Software Engineer II after 11 months of consistently exceeding expectations.
● Demonstrated technical expertise as the only non-senior engineer invited to lead sprint planning & participate in hiring interviews for software engineering roles.

Frontend Engineer, September 2021 – June 2022
● Promoted to Software Engineer I after nine months of outstanding performance.
● Collaborated with a remote, cross-functional team to deliver tested, scalable features

Developer Support Engineer, February 2021 – September 2021
● Promoted to Frontend Engineer after seven months of successfully solving user & customer inquiries.

Technical Training

General Assembly, Software Engineering Bootcamp Certificate, June 2020 – September 2020

Non-technical Work Experience

Teacher & Department Chair- Crown Point Community Schools (Indiana), August 2016 – June 2020
Teacher - School City of Hammond (Indiana), August 2015 – August 2016

Formal Education

DePaul University, Master of Music, 2013
Indiana University, Bachelor of Music, 2011`

export class MockProvider implements AIProvider {
  private delayMs: number

  constructor(options: MockProviderOptions = {}) {
    this.delayMs = options.delayMs ?? 1000
  }

  async generateCompletion(
    request: AICompletionRequest
  ): Promise<AICompletionResponse> {
    await this.simulateDelay()

    const promptTokens = Math.ceil(request.prompt.length / 4)
    const completionTokens = Math.ceil(MOCK_RESUME_CONTENT.length / 4)

    return {
      content: MOCK_RESUME_CONTENT,
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
