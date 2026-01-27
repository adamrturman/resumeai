import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useClipboard } from '../useClipboard'

describe('useClipboard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return copied as false initially', () => {
    const { result } = renderHook(() => useClipboard())

    expect(result.current.copied).toBe(false)
  })

  it('should copy text to clipboard', async () => {
    const { result } = renderHook(() => useClipboard())

    await act(async () => {
      await result.current.copy('Hello World')
    })

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hello World')
  })

  it('should set copied to true after copying', async () => {
    const { result } = renderHook(() => useClipboard())

    await act(async () => {
      await result.current.copy('Test')
    })

    expect(result.current.copied).toBe(true)
  })

  it('should reset copied to false after timeout', async () => {
    const { result } = renderHook(() => useClipboard())

    await act(async () => {
      await result.current.copy('Test')
    })

    expect(result.current.copied).toBe(true)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current.copied).toBe(false)
  })

  it('should handle clipboard errors gracefully', async () => {
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(
      new Error('Clipboard failed')
    )

    const { result } = renderHook(() => useClipboard())

    await act(async () => {
      await result.current.copy('Test')
    })

    expect(result.current.copied).toBe(false)
  })
})
