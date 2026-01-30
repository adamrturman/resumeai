export interface AICompletionRequest {
  prompt: string
  maxTokens?: number
  temperature?: number
}

export interface ResumeContent {
  companyName: string
  technicalSkills: string[]
  usedKeywords: string[]
  bullets: {
    seniorEngineer: string[]
    engineerII: string[]
    engineerI: string[]
    frontendEngineer: string[]
    developerSupport: string[]
  }
}

export interface AICompletionResponse {
  content: string
  resumeData?: ResumeContent
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface AIProvider {
  generateCompletion(
    request: AICompletionRequest
  ): Promise<AICompletionResponse>
}
