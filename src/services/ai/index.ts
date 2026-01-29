import type { AIProvider } from './types'
import { MockProvider } from './MockProvider'
import { OpenAIProvider } from './OpenAIProvider'
import { OllamaProvider } from './OllamaProvider'

export type AIProviderType = 'mock' | 'openai' | 'ollama'

let providerInstance: AIProvider | null = null

export function createAIProvider(type?: AIProviderType): AIProvider {
  const providerType = type ?? import.meta.env.VITE_AI_PROVIDER
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (providerType === 'ollama') {
    return new OllamaProvider({
      baseUrl: import.meta.env.VITE_OLLAMA_BASE_URL,
      model: import.meta.env.VITE_OLLAMA_MODEL,
    })
  }

  if (providerType === 'openai' || (apiKey && providerType !== 'mock')) {
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
export { OllamaProvider } from './OllamaProvider'
export type {
  AIProvider,
  AICompletionRequest,
  AICompletionResponse,
} from './types'
