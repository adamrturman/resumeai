import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useResumeGeneration } from '../useResumeGeneration'

describe('useResumeGeneration', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return initial state', () => {
    const { result } = renderHook(() => useResumeGeneration())

    expect(result.current.resume).toBeNull()
    expect(result.current.companyName).toBe('')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should set loading to true when generating', () => {
    const { result } = renderHook(() => useResumeGeneration())

    act(() => {
      result.current.generate('Job description at Google')
    })

    expect(result.current.loading).toBe(true)
  })

  it('should generate resume from job description', async () => {
    vi.useRealTimers()
    const { result } = renderHook(() => useResumeGeneration())

    await act(async () => {
      await result.current.generate('Software Engineer at Google')
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.resume).toContain('Summary')
  })

  it('should extract company name from job description', async () => {
    vi.useRealTimers()
    const { result } = renderHook(() => useResumeGeneration())

    await act(async () => {
      await result.current.generate('Software Engineer at Google')
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.companyName).toBe('Google')
  })

  it('should provide reset function to clear state', async () => {
    vi.useRealTimers()
    const { result } = renderHook(() => useResumeGeneration())

    await act(async () => {
      await result.current.generate('Test job at TestCo')
    })

    await waitFor(() => {
      expect(result.current.resume).not.toBeNull()
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.resume).toBeNull()
    expect(result.current.companyName).toBe('')
    expect(result.current.error).toBeNull()
  })
})
