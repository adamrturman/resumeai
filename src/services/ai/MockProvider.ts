import type { AIProvider, AICompletionRequest, AICompletionResponse } from './types'

export interface MockProviderOptions {
  delayMs?: number
}

const MOCK_RESUME_CONTENT = `
## Summary
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Experienced professional with demonstrated history of delivering results in fast-paced environments.

## Experience

### Senior Software Engineer | Tech Company
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
- Led development of scalable microservices architecture
- Mentored junior team members and conducted code reviews
- Collaborated with cross-functional teams on product initiatives

### Software Engineer | Startup Inc
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
- Built responsive web applications using modern frameworks
- Implemented automated testing and CI/CD pipelines
- Reduced deployment time by 60% through optimization

## Skills
- TypeScript, JavaScript, React, Node.js
- Python, PostgreSQL, MongoDB
- AWS, Docker, Kubernetes
- Agile methodologies, Team Leadership

## Education
Bachelor of Science in Computer Science
University Name, Graduated 2020
`.trim()

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
