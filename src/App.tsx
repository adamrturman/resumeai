import { useState } from 'react'
import { JobDescriptionInput } from './components/JobDescriptionInput/JobDescriptionInput'
import { GenerateButton } from './components/GenerateButton/GenerateButton'
import { ErrorDisplay } from './components/ErrorDisplay/ErrorDisplay'
import { ResumeOutput } from './components/ResumeOutput/ResumeOutput'
import { useResumeGeneration } from './hooks/useResumeGeneration'
import { useClipboard } from './hooks/useClipboard'
import { generatePdf } from './services/pdf/pdfGenerator'
import './App.css'

function App() {
  const [jobDescription, setJobDescription] = useState('')
  const { resume, companyName, loading, error, generate, reset } =
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

  const handleDownload = () => {
    if (resume) {
      generatePdf(resume, companyName)
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
        <section className="input-section">
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
        </section>

        <ErrorDisplay error={error} />

        <section className="output-section">
          <ResumeOutput
            content={resume}
            companyName={companyName}
            onCopy={handleCopy}
            onDownload={handleDownload}
            copied={copied}
          />
        </section>
      </main>
    </div>
  )
}

export default App
