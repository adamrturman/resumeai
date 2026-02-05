export interface AssertionFailure {
  pass: false
  score: 0
  reason: string
}

export type AssertionResult = true | AssertionFailure

export interface AssertionContext {
  vars: {
    jobDescription?: string
    [key: string]: unknown
  }
}

export interface ResumeOutput {
  companyName?: string
  bullets?: Record<string, string[]>
  technicalSkills?: string[]
}
