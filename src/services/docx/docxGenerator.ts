import PizZip from 'pizzip'

export interface ResumeData {
  technicalSkills: string
  bullets: {
    seniorEngineer: string[]
    engineerII: string[]
    engineerI: string[]
    frontendEngineer: string[]
    developerSupport: string[]
  }
}

export async function loadTemplate(): Promise<ArrayBuffer> {
  const response = await fetch(
    '/Turman, Adam R - Software Engineer Resume (Bestow).docx'
  )
  return response.arrayBuffer()
}

interface JobSection {
  title: string
  key: keyof ResumeData['bullets']
  marker: string
}

const JOB_SECTIONS: JobSection[] = [
  {
    title: 'Senior Software Engineer',
    key: 'seniorEngineer',
    marker: 'Senior Software Engineer',
  },
  {
    title: 'Software Engineer II',
    key: 'engineerII',
    marker: 'Software Engineer II',
  },
  {
    title: 'Software Engineer I',
    key: 'engineerI',
    marker: 'Software Engineer I,',
  },
  {
    title: 'Frontend Engineer',
    key: 'frontendEngineer',
    marker: 'Frontend Engineer',
  },
  {
    title: 'Developer Support Engineer',
    key: 'developerSupport',
    marker: 'Developer Support Engineer',
  },
]

function createBulletParagraph(
  text: string,
  numId: string,
  isFirst: boolean
): string {
  const spacing = isFirst
    ? '<w:spacing w:after="0" w:afterAutospacing="0" w:before="240" w:lineRule="auto"/>'
    : '<w:spacing w:after="0" w:afterAutospacing="0" w:before="0" w:beforeAutospacing="0" w:lineRule="auto"/>'

  return `<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="${numId}"/></w:numPr>${spacing}<w:ind w:left="720" w:hanging="360"/><w:rPr><w:sz w:val="16"/><w:szCs w:val="16"/></w:rPr></w:pPr><w:r><w:rPr><w:sz w:val="16"/><w:szCs w:val="16"/><w:rtl w:val="0"/></w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function replaceBulletsForSection(
  xml: string,
  sectionMarker: string,
  nextSectionMarker: string | null,
  newBullets: string[]
): string {
  // Find the section start
  const sectionStart = xml.indexOf(sectionMarker)
  if (sectionStart === -1) return xml

  // Find section end (next job title or end of work experience)
  let sectionEnd: number
  if (nextSectionMarker) {
    sectionEnd = xml.indexOf(
      nextSectionMarker,
      sectionStart + sectionMarker.length
    )
    if (sectionEnd === -1) sectionEnd = xml.length
  } else {
    // For last section, find "Technical Training" as the boundary
    sectionEnd = xml.indexOf('Technical Training', sectionStart)
    if (sectionEnd === -1) sectionEnd = xml.length
  }

  const beforeSection = xml.substring(0, sectionStart)
  const section = xml.substring(sectionStart, sectionEnd)
  const afterSection = xml.substring(sectionEnd)

  // Find all bullet paragraphs in this section (paragraphs with <w:numPr>)
  const bulletRegex = /<w:p[^>]*>(?=<w:pPr><w:numPr>).*?<\/w:p>/g
  const bullets = section.match(bulletRegex) || []

  const firstBullet = bullets[0]
  const lastBullet = bullets[bullets.length - 1]
  if (!firstBullet || !lastBullet) return xml

  // Extract the numId from the first bullet
  const numIdMatch = firstBullet.match(/<w:numId w:val="(\d+)"/)
  const numId = numIdMatch ? numIdMatch[1] : '1'

  // Find where bullets start in the section
  const firstBulletIndex = section.indexOf(firstBullet)
  const lastBulletEndIndex = section.lastIndexOf(lastBullet) + lastBullet.length

  // Build new bullets
  const newBulletXml = newBullets
    .map((text, i) => createBulletParagraph(text, numId, i === 0))
    .join('')

  // Replace old bullets with new ones
  const newSection =
    section.substring(0, firstBulletIndex) +
    newBulletXml +
    section.substring(lastBulletEndIndex)

  return beforeSection + newSection + afterSection
}

export function modifyResume(
  templateBuffer: ArrayBuffer,
  data: ResumeData
): Blob {
  const zip = new PizZip(templateBuffer)

  const xmlContent = zip.file('word/document.xml')?.asText()
  if (!xmlContent) {
    throw new Error('Could not read document.xml from template')
  }

  let modifiedXml = xmlContent

  // Replace technical skills
  const skillsRegex =
    /(<w:t[^>]*>Technical skills: <\/w:t><\/w:r>.*?<w:t[^>]*>)([^<]+)(<\/w:t>)/
  modifiedXml = modifiedXml.replace(skillsRegex, `$1${data.technicalSkills}$3`)

  // Alternative pattern if skills are in different structure
  const skillsRegex2 = /(>Technical skills: )([^<]+)(<\/w:t>)/
  modifiedXml = modifiedXml.replace(skillsRegex2, `$1${data.technicalSkills}$3`)

  // Replace bullets for each job section
  for (let i = 0; i < JOB_SECTIONS.length; i++) {
    const section = JOB_SECTIONS[i]
    const nextSection = JOB_SECTIONS[i + 1] || null
    const bullets = data.bullets[section.key]

    if (bullets && bullets.length > 0) {
      modifiedXml = replaceBulletsForSection(
        modifiedXml,
        section.marker,
        nextSection?.marker || null,
        bullets
      )
    }
  }

  zip.file('word/document.xml', modifiedXml)

  const output = zip.generate({
    type: 'blob',
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })

  return output
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const PDF_SERVER_URL = 'http://localhost:3001'

async function convertToPdf(docxBlob: Blob): Promise<Blob> {
  const formData = new FormData()
  formData.append('file', docxBlob, 'resume.docx')

  const response = await fetch(`${PDF_SERVER_URL}/convert-to-pdf`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to convert to PDF')
  }

  return response.blob()
}

export async function generateResume(
  data: ResumeData,
  companyName: string
): Promise<void> {
  const templateBuffer = await loadTemplate()
  const modifiedDoc = modifyResume(templateBuffer, data)

  const pdfBlob = await convertToPdf(modifiedDoc)

  const filename = companyName
    ? `Turman, Adam - Resume (${companyName}).pdf`
    : 'Turman, Adam - Resume.pdf'

  downloadBlob(pdfBlob, filename)
}
