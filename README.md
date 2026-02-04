# ResumeAI

A single-page app that generates customized resumes from job descriptions using AI, with safeguards against hallucinating skills.

## The Problem

LLMs lie on resumes. When asked to tailor a resume for a job, they often:
- Invent skills you don't have ("5+ years of COBOL experience")
- Insert the target company name into resume bullets
- Fabricate achievements that never happened

These aren't minor issues—a recruiter finding skills you can't demonstrate is an instant rejection.

## The Solution

This project uses **test-driven prompt engineering** with [Promptfoo](https://promptfoo.dev/) to empirically verify that prompts prevent hallucination.

### Progressive Prompt Structure

Three prompts build on each other:

| Prompt | Description |
|--------|-------------|
| v1 | Basic guidance only—no guardrails |
| v2 | Adds explicit rules against hallucinating skills |
| v3 | Adds good/bad examples showing correct behavior |

### Automated Assertions

Two JavaScript assertions run against every prompt/job combination:

- **`no-forbidden-terms.js`** — Fails if output contains skills not in the base resume (COBOL, AWS, Kubernetes, etc.)
- **`required-terms-present.js`** — Fails if the job mentions skills from the base resume but they're missing from the output

### Single Source of Truth

Resume data lives in `src/data/baseResume.ts`. A build script generates the prompt data before each eval—no duplication.

## Running the Evaluation

```bash
# Install dependencies
npm install

# Run Promptfoo evaluation (generates resume data, then runs eval)
npm run promptfoo

# View results in browser
npm run promptfoo:view
```

Requires [Ollama](https://ollama.ai/) running locally with the `llama3.2` model:

```bash
ollama pull llama3.2
```

## Project Structure

```
src/
├── data/
│   └── baseResume.ts        # Single source of truth for resume data
promptfoo/
├── prompt-v1.txt            # Basic guidance
├── prompt-v2.txt            # + Guard rails
├── prompt-v3.txt            # + Examples
├── assertions/
│   ├── no-forbidden-terms.js
│   └── required-terms-present.js
├── jobs/*.txt               # Job descriptions (auto-loaded via glob)
├── forbidden-terms.txt      # Skills NOT in resume
└── resume-data.txt          # Generated from baseResume.ts (gitignored)
scripts/
└── generate-resume-data.ts  # Generates prompt data from baseResume.ts
promptfooconfig.yaml         # Test configuration
```

## Other Commands

```bash
npm run dev          # Start dev server
npm test             # Run tests
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run fetch-jobs   # Fetch job descriptions from RemoteOK
```
