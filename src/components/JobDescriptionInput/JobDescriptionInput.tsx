import './JobDescriptionInput.css'

interface JobDescriptionInputProps {
  value: string
  onChange: (value: string) => void
}

export function JobDescriptionInput({
  value,
  onChange,
}: JobDescriptionInputProps) {
  return (
    <div className="job-description-input">
      <label htmlFor="job-description">Job Description</label>
      <textarea
        id="job-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here..."
        rows={10}
      />
    </div>
  )
}
