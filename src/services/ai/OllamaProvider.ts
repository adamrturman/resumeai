import type {
  AIProvider,
  AICompletionRequest,
  AICompletionResponse,
  ResumeContent,
} from './types'

export interface OllamaProviderOptions {
  baseUrl?: string
  model?: string
}

export class OllamaProvider implements AIProvider {
  private baseUrl: string
  private model: string

  constructor(options: OllamaProviderOptions = {}) {
    this.baseUrl = options.baseUrl ?? 'http://localhost:11434'
    this.model = options.model ?? 'llama3.2'
  }

  async generateCompletion(
    request: AICompletionRequest
  ): Promise<AICompletionResponse> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a resume customization assistant. Reword bullet points to emphasize job-relevant experience, but never invent skills or achievements. Include ALL bullet points from each role. Respond with valid JSON only, no markdown or explanation.',
          },
          {
            role: 'user',
            content: request.prompt,
          },
        ],
        stream: false,
        options: {
          num_predict: request.maxTokens ?? 2000,
          temperature: request.temperature ?? 0.3,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Ollama API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    const content = data.message?.content ?? ''

    const resumeData = this.parseResumeContent(content)

    return {
      content: this.formatResumeAsText(resumeData),
      resumeData,
      usage: {
        promptTokens: data.prompt_eval_count ?? 0,
        completionTokens: data.eval_count ?? 0,
        totalTokens: (data.prompt_eval_count ?? 0) + (data.eval_count ?? 0),
      },
    }
  }

  private parseResumeContent(content: string): ResumeContent {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON from Ollama response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      companyName: parsed.companyName || 'Company',
      technicalSkills: parsed.technicalSkills || [],
      usedKeywords: parsed.usedKeywords || [],
      bullets: {
        seniorEngineer: parsed.bullets?.seniorEngineer || [],
        engineerII: parsed.bullets?.engineerII || [],
        engineerI: parsed.bullets?.engineerI || [],
        frontendEngineer: parsed.bullets?.frontendEngineer || [],
        developerSupport: parsed.bullets?.developerSupport || [],
      },
    }
  }

  private formatResumeAsText(data: ResumeContent): string {
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
}
