import { describe, it, expect } from 'vitest'
import { createAIProvider, getAIProvider } from '../index'
import { MockProvider } from '../MockProvider'

describe('AI Provider Factory', () => {
  describe('createAIProvider', () => {
    it('should create a MockProvider when type is "mock"', () => {
      const provider = createAIProvider('mock')
      expect(provider).toBeInstanceOf(MockProvider)
    })

    it('should create a MockProvider when type is "openai" but no API key', () => {
      const provider = createAIProvider('openai')
      expect(provider).toBeInstanceOf(MockProvider)
    })

    it('should default to mock provider when type is not specified', () => {
      const provider = createAIProvider()
      expect(provider).toBeInstanceOf(MockProvider)
    })
  })

  describe('getAIProvider', () => {
    it('should return a singleton instance', () => {
      const provider1 = getAIProvider()
      const provider2 = getAIProvider()
      expect(provider1).toBe(provider2)
    })

    it('should return MockProvider by default', () => {
      const provider = getAIProvider()
      expect(provider).toBeInstanceOf(MockProvider)
    })
  })
})
