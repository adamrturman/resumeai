import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MockProvider } from '../MockProvider'

describe('MockProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should implement AIProvider interface', () => {
    const provider = new MockProvider()
    expect(provider.generateCompletion).toBeDefined()
    expect(typeof provider.generateCompletion).toBe('function')
  })

  it('should return a response with lorem ipsum content', async () => {
    const provider = new MockProvider()
    const promise = provider.generateCompletion({ prompt: 'test prompt' })

    vi.advanceTimersByTime(1000)
    const response = await promise

    expect(response.content).toBeDefined()
    expect(typeof response.content).toBe('string')
    expect(response.content.length).toBeGreaterThan(0)
  })

  it('should simulate API delay', async () => {
    const provider = new MockProvider()
    let resolved = false

    const promise = provider.generateCompletion({ prompt: 'test' }).then(() => {
      resolved = true
    })

    expect(resolved).toBe(false)

    vi.advanceTimersByTime(500)
    expect(resolved).toBe(false)

    vi.advanceTimersByTime(500)
    await promise
    expect(resolved).toBe(true)
  })

  it('should return usage statistics', async () => {
    const provider = new MockProvider()
    const promise = provider.generateCompletion({ prompt: 'test' })

    vi.advanceTimersByTime(1000)
    const response = await promise

    expect(response.usage).toBeDefined()
    expect(response.usage?.promptTokens).toBeGreaterThan(0)
    expect(response.usage?.completionTokens).toBeGreaterThan(0)
    expect(response.usage?.totalTokens).toBe(
      (response.usage?.promptTokens ?? 0) +
        (response.usage?.completionTokens ?? 0)
    )
  })

  it('should return content resembling a resume structure', async () => {
    const provider = new MockProvider()
    const promise = provider.generateCompletion({
      prompt: 'Generate resume for software engineer',
    })

    vi.advanceTimersByTime(1000)
    const response = await promise

    expect(response.content).toContain('Summary')
    expect(response.content).toContain('Experience')
    expect(response.content).toContain('Skills')
  })

  it('should allow configurable delay', async () => {
    const provider = new MockProvider({ delayMs: 500 })
    let resolved = false

    const promise = provider.generateCompletion({ prompt: 'test' }).then(() => {
      resolved = true
    })

    vi.advanceTimersByTime(400)
    expect(resolved).toBe(false)

    vi.advanceTimersByTime(100)
    await promise
    expect(resolved).toBe(true)
  })
})
