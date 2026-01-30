export interface DiffSegment {
  text: string
  type: 'unchanged' | 'added' | 'removed' | 'added-from-job'
}

/**
 * Computes a word-level diff between original and modified text.
 * Uses longest common subsequence algorithm to find unchanged words.
 * If usedKeywords is provided, marks added segments that match any keyword.
 */
export function computeWordDiff(
  original: string,
  modified: string,
  usedKeywords?: string[]
): DiffSegment[] {
  const originalWords = tokenize(original)
  const modifiedWords = tokenize(modified)

  const lcs = findLCS(originalWords, modifiedWords)
  const segments = buildDiffSegments(originalWords, modifiedWords, lcs)

  if (usedKeywords && usedKeywords.length > 0) {
    return markKeywordMatches(segments, usedKeywords)
  }
  return segments
}

function tokenize(text: string): string[] {
  // Split on word boundaries while preserving punctuation attached to words
  return text.split(/(\s+)/).filter((token) => token.length > 0)
}

function findLCS(a: string[], b: string[]): Set<string> {
  // Build LCS table
  const m = a.length
  const n = b.length
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1].toLowerCase() === b[j - 1].toLowerCase()) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Backtrack to find which indices are part of LCS in the modified array
  const lcsIndicesInB = new Set<number>()
  let i = m
  let j = n
  while (i > 0 && j > 0) {
    if (a[i - 1].toLowerCase() === b[j - 1].toLowerCase()) {
      lcsIndicesInB.add(j - 1)
      i--
      j--
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--
    } else {
      j--
    }
  }

  // Return set of position keys for modified words that are in LCS
  const result = new Set<string>()
  lcsIndicesInB.forEach((idx) => {
    result.add(`${idx}`)
  })
  return result
}

function buildDiffSegments(
  _original: string[],
  modified: string[],
  lcsIndices: Set<string>
): DiffSegment[] {
  const segments: DiffSegment[] = []

  for (let i = 0; i < modified.length; i++) {
    const word = modified[i]
    const isWhitespace = /^\s+$/.test(word)

    if (isWhitespace) {
      // Find the previous and next non-whitespace words to determine type
      const prevType = findPrevNonWhitespaceType(modified, i, lcsIndices)
      const nextType = findNextNonWhitespaceType(modified, i, lcsIndices)
      // Mark whitespace as 'added' only if both surrounding words are 'added'
      const type =
        prevType === 'added' && nextType === 'added' ? 'added' : 'unchanged'
      segments.push({ text: word, type })
    } else if (lcsIndices.has(`${i}`)) {
      segments.push({ text: word, type: 'unchanged' })
    } else {
      segments.push({ text: word, type: 'added' })
    }
  }

  // Merge consecutive segments of the same type
  return mergeSegments(segments)
}

function findPrevNonWhitespaceType(
  tokens: string[],
  currentIndex: number,
  lcsIndices: Set<string>
): 'added' | 'unchanged' | null {
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (!/^\s+$/.test(tokens[i])) {
      return lcsIndices.has(`${i}`) ? 'unchanged' : 'added'
    }
  }
  return null
}

function findNextNonWhitespaceType(
  tokens: string[],
  currentIndex: number,
  lcsIndices: Set<string>
): 'added' | 'unchanged' | null {
  for (let i = currentIndex + 1; i < tokens.length; i++) {
    if (!/^\s+$/.test(tokens[i])) {
      return lcsIndices.has(`${i}`) ? 'unchanged' : 'added'
    }
  }
  return null
}

function mergeSegments(segments: DiffSegment[]): DiffSegment[] {
  if (segments.length === 0) return []

  const merged: DiffSegment[] = []
  let current = { ...segments[0] }

  for (let i = 1; i < segments.length; i++) {
    const seg = segments[i]
    if (seg.type === current.type) {
      current.text += seg.text
    } else {
      merged.push(current)
      current = { ...seg }
    }
  }
  merged.push(current)

  return merged
}

/**
 * Marks 'added' segments as 'added-from-job' if they contain any of the used keywords.
 * Uses case-insensitive word-boundary matching.
 */
function markKeywordMatches(
  segments: DiffSegment[],
  usedKeywords: string[]
): DiffSegment[] {
  const keywordPatterns = usedKeywords.map((keyword) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(`\\b${escaped}\\b`, 'i')
  })

  return segments.map((segment) => {
    if (segment.type === 'added') {
      const textToMatch = segment.text.trim()
      if (textToMatch.length > 0) {
        const matchesKeyword = keywordPatterns.some((pattern) =>
          pattern.test(textToMatch)
        )
        if (matchesKeyword) {
          return { ...segment, type: 'added-from-job' as const }
        }
      }
    }
    return segment
  })
}

/**
 * Finds the best matching original bullet for a modified bullet.
 * Uses a simple similarity score based on common words.
 */
export function findBestMatch(
  modified: string,
  originals: string[]
): string | null {
  if (originals.length === 0) return null

  const modifiedWords = new Set(
    modified.toLowerCase().split(/\s+/).filter(Boolean)
  )

  let bestMatch = originals[0]
  let bestScore = 0

  for (const original of originals) {
    const originalWords = original.toLowerCase().split(/\s+/).filter(Boolean)
    let commonCount = 0
    for (const word of originalWords) {
      if (modifiedWords.has(word)) {
        commonCount++
      }
    }
    const score = commonCount / Math.max(originalWords.length, 1)
    if (score > bestScore) {
      bestScore = score
      bestMatch = original
    }
  }

  return bestMatch
}
