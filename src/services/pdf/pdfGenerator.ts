import jsPDF from 'jspdf'

const CANDIDATE_NAME = 'Turman, Adam'

export function getFilename(companyName: string): string {
  if (!companyName) {
    return `${CANDIDATE_NAME} - Resume.pdf`
  }
  return `${CANDIDATE_NAME} - Resume (${companyName}).pdf`
}

export async function generatePdf(
  content: string,
  companyName: string
): Promise<void> {
  const doc = new jsPDF()

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const maxWidth = pageWidth - margin * 2

  doc.setFontSize(11)

  const lines = content.split('\n')
  let y = margin

  for (const line of lines) {
    const wrappedLines = doc.splitTextToSize(line, maxWidth)
    for (const wrappedLine of wrappedLines) {
      if (y > 280) {
        doc.addPage()
        y = margin
      }
      doc.text(wrappedLine, margin, y)
      y += 6
    }
  }

  const filename = getFilename(companyName)
  doc.save(filename)
}
