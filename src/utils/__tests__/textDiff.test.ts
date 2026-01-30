import { describe, it, expect } from 'vitest'
import { computeWordDiff, findBestMatch } from '../textDiff'

describe('textDiff', () => {
  describe('computeWordDiff', () => {
    it('should return unchanged segments when texts are identical', () => {
      const result = computeWordDiff('hello world', 'hello world')
      expect(result).toEqual([{ text: 'hello world', type: 'unchanged' }])
    })

    it('should mark added words with space merged into unchanged', () => {
      const result = computeWordDiff('hello world', 'hello beautiful world')
      // Space after 'beautiful' merges with 'world' since both are unchanged
      expect(result).toHaveLength(3)
      expect(result[0]).toEqual({ text: 'hello ', type: 'unchanged' })
      expect(result[1]).toEqual({ text: 'beautiful', type: 'added' })
      expect(result[2]).toEqual({ text: ' world', type: 'unchanged' })
    })

    it('should mark replaced words as added', () => {
      const result = computeWordDiff('hello world', 'hello universe')
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({ text: 'hello ', type: 'unchanged' })
      expect(result[1]).toEqual({ text: 'universe', type: 'added' })
    })

    it('should merge consecutive added words with their spaces', () => {
      const result = computeWordDiff('a b c', 'a x y c')
      // Space between x and y is 'added', but space after y is 'unchanged' and merges with c
      expect(result).toHaveLength(3)
      expect(result[0]).toEqual({ text: 'a ', type: 'unchanged' })
      expect(result[1]).toEqual({ text: 'x y', type: 'added' })
      expect(result[2]).toEqual({ text: ' c', type: 'unchanged' })
    })

    it('should not merge space when between added and unchanged', () => {
      const result = computeWordDiff('a b c', 'a x c')
      // Space after x merges with c since both are unchanged
      expect(result).toHaveLength(3)
      expect(result[0]).toEqual({ text: 'a ', type: 'unchanged' })
      expect(result[1]).toEqual({ text: 'x', type: 'added' })
      expect(result[2]).toEqual({ text: ' c', type: 'unchanged' })
    })

    describe('with usedKeywords matching', () => {
      it('should mark added text as from-job when it matches a keyword', () => {
        const original = 'Built web applications'
        const modified = 'Built React web applications'
        const usedKeywords = ['React', 'TypeScript']

        const result = computeWordDiff(original, modified, usedKeywords)

        const reactSegment = result.find((s) => s.text.includes('React'))
        expect(reactSegment).toBeDefined()
        expect(reactSegment?.type).toBe('added-from-job')
      })

      it('should keep added text as added when not in keywords', () => {
        const original = 'Built web applications'
        const modified = 'Built Vue web applications'
        const usedKeywords = ['React', 'TypeScript']

        const result = computeWordDiff(original, modified, usedKeywords)

        const vueSegment = result.find((s) => s.text.includes('Vue'))
        expect(vueSegment).toBeDefined()
        expect(vueSegment?.type).toBe('added')
      })

      it('should be case-insensitive when matching keywords', () => {
        const original = 'Developed features'
        const modified = 'Developed TypeScript features'
        const usedKeywords = ['typescript', 'javascript']

        const result = computeWordDiff(original, modified, usedKeywords)

        const tsSegment = result.find((s) =>
          s.text.toLowerCase().includes('typescript')
        )
        expect(tsSegment).toBeDefined()
        expect(tsSegment?.type).toBe('added-from-job')
      })

      it('should match multi-word keywords', () => {
        const original = 'Led projects'
        const modified = 'Led cross-functional team projects'
        const usedKeywords = ['cross-functional', 'agile']

        const result = computeWordDiff(original, modified, usedKeywords)

        const phraseSegment = result.find((s) =>
          s.text.includes('cross-functional')
        )
        expect(phraseSegment).toBeDefined()
        expect(phraseSegment?.type).toBe('added-from-job')
      })

      it('should not mark unchanged text even if it matches a keyword', () => {
        const original = 'Built React applications'
        const modified = 'Built React applications'
        const usedKeywords = ['React']

        const result = computeWordDiff(original, modified, usedKeywords)

        expect(result).toHaveLength(1)
        expect(result[0].type).toBe('unchanged')
      })

      it('should use word boundaries to avoid partial matches', () => {
        const original = 'Built apps'
        const modified = 'Built reactive apps'
        const usedKeywords = ['React']

        const result = computeWordDiff(original, modified, usedKeywords)

        const reactiveSegment = result.find((s) => s.text.includes('reactive'))
        expect(reactiveSegment).toBeDefined()
        expect(reactiveSegment?.type).toBe('added')
      })

      it('should not highlight when keywords array is empty', () => {
        const original = 'Built apps'
        const modified = 'Built React apps'
        const usedKeywords: string[] = []

        const result = computeWordDiff(original, modified, usedKeywords)

        const reactSegment = result.find((s) => s.text.includes('React'))
        expect(reactSegment).toBeDefined()
        expect(reactSegment?.type).toBe('added')
      })
    })
  })

  describe('findBestMatch', () => {
    it('should return null for empty originals array', () => {
      const result = findBestMatch('some text', [])
      expect(result).toBeNull()
    })

    it('should find exact match', () => {
      const originals = ['hello world', 'foo bar', 'test text']
      const result = findBestMatch('hello world', originals)
      expect(result).toBe('hello world')
    })

    it('should find best matching text based on common words', () => {
      const originals = [
        'Built scalable web applications using React',
        'Managed team of engineers',
        'Wrote documentation for APIs',
      ]
      const modified =
        'Built modern web applications using React and TypeScript'
      const result = findBestMatch(modified, originals)
      expect(result).toBe('Built scalable web applications using React')
    })

    it('should return first item when no good match exists', () => {
      const originals = ['apple orange banana', 'grape melon']
      const result = findBestMatch('completely different text', originals)
      expect(result).toBe('apple orange banana')
    })
  })
})
