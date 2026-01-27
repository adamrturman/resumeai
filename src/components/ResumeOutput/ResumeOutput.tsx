import './ResumeOutput.css'

interface ResumeOutputProps {
  content: string | null
  companyName: string
  onCopy: () => void
  onDownload: () => void
  copied?: boolean
}

export function ResumeOutput({
  content,
  onCopy,
  onDownload,
  copied,
}: ResumeOutputProps) {
  if (!content) {
    return null
  }

  return (
    <div className="resume-output">
      <div className="resume-output-header">
        <h2>Generated Resume</h2>
        <div className="resume-output-actions">
          <button onClick={onCopy} className="copy-button">
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button onClick={onDownload} className="download-button">
            Download PDF
          </button>
        </div>
      </div>
      <div className="resume-content">
        {content.split('\n').map((line, index) => (
          <p key={index}>{line || '\u00A0'}</p>
        ))}
      </div>
    </div>
  )
}
