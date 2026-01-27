import type { AIProvider } from './types'
import { MockProvider } from './MockProvider'

export type AIProviderType = 'mock' | 'openai'

let providerInstance: AIProvider | null = null

export function createAIProvider(type?: AIProviderType): AIProvider {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (type === 'openai' && apiKey) {
    // TODO: Return OpenAIProvider when implemented
    return new MockProvider()
  }

  return new MockProvider()
}

export function getAIProvider(): AIProvider {
  if (!providerInstance) {
    providerInstance = createAIProvider()
  }
  return providerInstance
}

export { MockProvider } from './MockProvider'
export type { AIProvider, AICompletionRequest, AICompletionResponse } from './types'
