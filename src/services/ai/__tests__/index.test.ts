import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAIProvider, getAIProvider } from '../index'
import { MockProvider } from '../MockProvider'
import { OpenAIProvider } from '../OpenAIProvider'

describe('AI Provider Factory', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  describe('createAIProvider', () => {
    it('should create a MockProvider when type is "mock"', () => {
      const provider = createAIProvider('mock')
      expect(provider).toBeInstanceOf(MockProvider)
    })

    it('should create a MockProvider when no API key is set', () => {
      vi.stubEnv('VITE_OPENAI_API_KEY', '')
      const provider = createAIProvider()
      expect(provider).toBeInstanceOf(MockProvider)
    })

    it('should create an OpenAIProvider when API key is set', () => {
      vi.stubEnv('VITE_OPENAI_API_KEY', 'test-api-key')
      const provider = createAIProvider()
      expect(provider).toBeInstanceOf(OpenAIProvider)
    })

    it('should create a MockProvider when type is "mock" even with API key', () => {
      vi.stubEnv('VITE_OPENAI_API_KEY', 'test-api-key')
      const provider = createAIProvider('mock')
      expect(provider).toBeInstanceOf(MockProvider)
    })
  })

  describe('getAIProvider', () => {
    it('should return a singleton instance', () => {
      const provider1 = getAIProvider()
      const provider2 = getAIProvider()
      expect(provider1).toBe(provider2)
    })
  })
})
