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
  // Find the pattern: "Technical skills: </w:t></w:r><w:r...><w:t...>SKILLS_HERE</w:t>"
  const skillsRegex =
    /(Technical skills: <\/w:t><\/w:r>.*?<w:t[^>]*>)([^<]+)(<\/w:t>)/
  modifiedXml = modifiedXml.replace(skillsRegex, `$1${data.technicalSkills}$3`)

  // Alternative pattern if skills are in same run
  const skillsRegex2 = /(Technical skills: )([^<]+)(<\/w:t>)/
  modifiedXml = modifiedXml.replace(skillsRegex2, `$1${data.technicalSkills}$3`)

  zip.file('word/document.xml', modifiedXml)

  const output = zip.generate({
    type: 'blob',
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })

  return output
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function generateResume(
  data: ResumeData,
  companyName: string
): Promise<void> {
  const templateBuffer = await loadTemplate()
  const modifiedDoc = modifyResume(templateBuffer, data)

  const filename = companyName
    ? `Turman, Adam - Resume (${companyName}).docx`
    : 'Turman, Adam - Resume.docx'

  downloadBlob(modifiedDoc, filename)
}
