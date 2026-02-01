import { useState } from 'react'
import { JobDescriptionInput } from './components/JobDescriptionInput/JobDescriptionInput'
import { GenerateButton } from './components/GenerateButton/GenerateButton'
import { ErrorDisplay } from './components/ErrorDisplay/ErrorDisplay'
import { ResumeOutput } from './components/ResumeOutput/ResumeOutput'
import { useResumeGeneration } from './hooks/useResumeGeneration'
import { useClipboard } from './hooks/useClipboard'
import { generateResume } from './services/docx/docxGenerator'
import './App.css'

function App() {
  const [jobDescription, setJobDescription] = useState('')
  const { resume, resumeData, companyName, loading, error, generate, reset } =
    useResumeGeneration()
  const { copied, copy } = useClipboard()

  const handleGenerate = () => {
    if (jobDescription.trim()) {
      generate(jobDescription)
    }
  }

  const handleCopy = () => {
    if (resume) {
      copy(resume)
    }
  }

  const handleDownload = async () => {
    if (resumeData) {
      try {
        await generateResume(
          {
            technicalSkills: resumeData.technicalSkills.join(', '),
            bullets: resumeData.bullets,
          },
          companyName
        )
      } catch (err) {
        console.error('Failed to generate document:', err)
      }
    }
  }

  const handleReset = () => {
    setJobDescription('')
    reset()
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Resume AI</h1>
        <p>Generate customized resumes from job descriptions</p>
      </header>

      <main className="app-main">
        <div className="content-panels">
          <section className="input-panel">
            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
            />
            <div className="button-group">
              <GenerateButton
                onClick={handleGenerate}
                disabled={!jobDescription.trim()}
                loading={loading}
              />
              {resume && (
                <button className="reset-button" onClick={handleReset}>
                  Start Over
                </button>
              )}
            </div>
            <ErrorDisplay error={error} />
          </section>

          <section className="output-panel">
            <ResumeOutput
              content={resume}
              resumeData={resumeData}
              companyName={companyName}
              usedKeywords={resumeData?.usedKeywords}
              onCopy={handleCopy}
              onDownload={handleDownload}
              copied={copied}
              loading={loading}
            />
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
