import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { exec } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import { promisify } from 'util'

const execAsync = promisify(exec)
const app = express()
const upload = multer({ storage: multer.memoryStorage() })

app.use(cors())
app.use(express.json())

const LIBREOFFICE_PATH =
  process.platform === 'darwin'
    ? '/Applications/LibreOffice.app/Contents/MacOS/soffice'
    : 'soffice'

app.post('/convert-to-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' })
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'resume-'))
  const inputPath = path.join(tempDir, 'input.docx')
  const outputPath = path.join(tempDir, 'input.pdf')

  try {
    await fs.writeFile(inputPath, req.file.buffer)

    const command = `"${LIBREOFFICE_PATH}" --headless --convert-to pdf --outdir "${tempDir}" "${inputPath}"`
    await execAsync(command)

    const pdfBuffer = await fs.readFile(outputPath)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"')
    res.send(pdfBuffer)
  } catch (error) {
    console.error('Conversion error:', error)
    res.status(500).json({ error: 'Failed to convert to PDF' })
  } finally {
    try {
      await fs.rm(tempDir, { recursive: true })
    } catch {
      // Cleanup failed, ignore
    }
  }
})

app.get('/health', (_, res) => {
  res.json({ status: 'ok' })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`PDF conversion server running on http://localhost:${PORT}`)
})
