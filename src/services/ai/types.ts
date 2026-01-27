export interface AICompletionRequest {
  prompt: string
  maxTokens?: number
  temperature?: number
}

export interface AICompletionResponse {
  content: string
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
