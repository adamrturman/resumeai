import type { ResumeContent } from '../../services/ai/types'
import './ResumeOutput.css'

interface ResumeOutputProps {
  content: string | null
  resumeData: ResumeContent | null
  companyName: string
  onCopy: () => void
  onDownload: () => void
  copied?: boolean
  loading?: boolean
}

const JOB_SECTIONS = [
  { key: 'seniorEngineer' as const, title: 'Senior Software Engineer' },
  { key: 'engineerII' as const, title: 'Software Engineer II' },
  { key: 'engineerI' as const, title: 'Software Engineer I' },
  { key: 'frontendEngineer' as const, title: 'Frontend Engineer' },
  { key: 'developerSupport' as const, title: 'Developer Support Engineer' },
]

function LoadingSkeleton() {
  return (
    <div className="resume-output">
      <div className="resume-output-header">
        <h2>Preview of Customized Sections</h2>
      </div>
      <div className="resume-preview skeleton-container">
        <div className="skeleton-overlay">
          <span className="spinner" aria-hidden="true" />
          <span className="loading-text">
            Generating<span className="animated-ellipsis" />
          </span>
        </div>
        <div className="skeleton-content" aria-hidden="true">
          <div className="preview-section skills-section">
            <div className="skeleton-label" />
            <div className="skeleton-line skeleton-line-full" />
            <div className="skeleton-line skeleton-line-medium" />
          </div>
          <div className="preview-section experience-section">
            <div className="skeleton-label" />
            {JOB_SECTIONS.map((section) => (
              <div key={section.key} className="skeleton-job-section">
                <div className="skeleton-job-title" />
                <div className="skeleton-bullets">
                  <div className="skeleton-line skeleton-line-full" />
                  <div className="skeleton-line skeleton-line-long" />
                  <div className="skeleton-line skeleton-line-medium" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ResumeOutput({
  content,
  resumeData,
  onCopy,
  onDownload,
  copied,
  loading,
}: ResumeOutputProps) {
  if (loading) {
    return <LoadingSkeleton />
  }

  if (!content || !resumeData) {
    return null
  }

  return (
    <div className="resume-output">
      <div className="resume-output-header">
        <h2>Preview of Customized Sections</h2>
        <div className="resume-output-actions">
          <button onClick={onCopy} className="copy-button">
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button onClick={onDownload} className="download-button">
            Download Resume
          </button>
        </div>
      </div>
      <div className="resume-preview">
        <div className="preview-section skills-section">
          <h3 className="preview-label">Technical Skills</h3>
          <p className="skills-text">
            <strong>Technical skills:</strong>{' '}
            {resumeData.technicalSkills.join(', ')}
          </p>
        </div>

        <div className="preview-section experience-section">
          <h3 className="preview-label">Work Experience Bullets</h3>
          {JOB_SECTIONS.map((section) => {
            const bullets = resumeData.bullets[section.key]
            if (!bullets || bullets.length === 0) return null
            return (
              <div key={section.key} className="job-section">
                <h4 className="job-title">{section.title}</h4>
                <ul className="bullet-list">
                  {bullets.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
