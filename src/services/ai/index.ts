import type { AIProvider } from './types'
import { MockProvider } from './MockProvider'
import { OpenAIProvider } from './OpenAIProvider'

export type AIProviderType = 'mock' | 'openai'

let providerInstance: AIProvider | null = null

export function createAIProvider(type?: AIProviderType): AIProvider {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (apiKey && type !== 'mock') {
    return new OpenAIProvider(apiKey)
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
export { OpenAIProvider } from './OpenAIProvider'
export type {
  AIProvider,
  AICompletionRequest,
  AICompletionResponse,
} from './types'
