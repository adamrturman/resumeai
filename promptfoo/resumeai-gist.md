# Resume AI: Prompt Engineering with Measurable Results

A single-page app that generates customized resumes from job descriptions using AI, with systematic prompt engineering validated through automated testing.

## How It Works

### 1. Paste a Job Description
The user pastes a job description which gets sent to the LLM along with their base resume data.

### 2. LLM Extracts and Matches Keywords
The AI analyzes the job description, identifies relevant skills from the user's resume, and generates tailored bullet points that emphasize matching experience.

### 3. Changes Are Highlighted
The app highlights what changed between the base resume and the customized version, making it easy to review modifications.

### 4. Download the Result
Export the tailored resume as a PDF with the format: `Turman, Adam - Resume (Company Name).pdf`

## The Problem: LLM Hallucinations

Without safeguards, LLMs can make egregious errors when customizing resumes:

- **Adding skills you don't have** - The model might claim expertise in technologies you've never used
- **Forgetting skills you do have** - Relevant experience from your actual resume gets dropped
- **Explicitly mentioning the company name** - Writing "Built systems for [Target Company]" when you never worked there

## The Solution: Promptfoo Testing

I used [Promptfoo](https://promptfoo.dev) to systematically test and improve system prompts with custom assertion functions:

```javascript
// no-forbidden-terms.ts - Catches hallucinated skills
const forbiddenTerms = ['scala', 'rust', 'go', ...] // skills I don't have
const found = forbiddenTerms.filter(term => matchesWordBoundary(bulletText, term))
if (found.length > 0) return { pass: false, reason: `Found forbidden terms: ${found}` }

// required-terms-present.ts - Ensures relevant skills are included
// Checks: if job mentions React and my resume has React, bullets should mention React

// no-company-in-bullets.ts - Prevents company name hallucination
if (matchesWordBoundary(bulletText, companyName)) return { pass: false }
```

## Prompt Evolution & Results

| Version | Approach | Pass Rate |
|---------|----------|-----------|
| v1 | Basic: "Pull relevant bullet points" | 38% |
| v2 | Added guardrails around common errors | 72% |
| v3 | Added examples of good and poor outcomes | 79% |

### Key Insight
Each iteration of prompt engineering produced measurable improvements. The assertions caught specific failure modes, which informed targeted prompt refinements.

## Why a Small Local Model?

I deliberately chose `ollama:llama3.2` (a small local model) for testing because:

1. **Enterprise models are too good** - GPT-4/Claude rarely make the mistakes we're testing for
2. **Exposes prompt weaknesses** - Smaller models surface edge cases that better prompts must handle
3. **If it works on a weak model**, it'll work even better on production models

## Tech Stack

- React 19 + Vite + TypeScript
- OpenAI-compatible API (swappable architecture)
- Vitest for unit tests
- Promptfoo for LLM evaluation

## Running the Tests

```bash
# Unit tests
npm run test:run

# Promptfoo evaluation
npx promptfoo eval
```

---

Built with systematic prompt engineering principles: measure, iterate, validate.
