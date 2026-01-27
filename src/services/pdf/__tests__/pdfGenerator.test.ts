import { describe, it, expect } from 'vitest'
import { getFilename } from '../pdfGenerator'

describe('pdfGenerator', () => {
  describe('getFilename', () => {
    it('should generate filename with company name', () => {
      const filename = getFilename('Google')

      expect(filename).toBe('Turman, Adam - Resume (Google).pdf')
    })

    it('should handle company name with spaces', () => {
      const filename = getFilename('Kava Labs')

      expect(filename).toBe('Turman, Adam - Resume (Kava Labs).pdf')
    })

    it('should use default when no company provided', () => {
      const filename = getFilename('')

      expect(filename).toBe('Turman, Adam - Resume.pdf')
    })

    it('should handle "Company" placeholder', () => {
      const filename = getFilename('Company')

      expect(filename).toBe('Turman, Adam - Resume (Company).pdf')
    })

    it('should handle special characters in company name', () => {
      const filename = getFilename('Amazon Web Services')

      expect(filename).toBe('Turman, Adam - Resume (Amazon Web Services).pdf')
    })
  })
})
