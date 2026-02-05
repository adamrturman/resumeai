# Resume AI: Prompt Engineering with Measurable Results

A single-page app that generates customized resumes from job descriptions using AI, with systematic prompt engineering validated through automated testing.

## How It Works

### Generate a Tailored Resume

1. **Paste a job description** to kick off the workflow
2. **AI analyzes the posting** — extracts keywords and matches them against your base resume data
3. **Review highlighted changes** — easily see what's been customized
4. **Export as PDF** — downloads as `Turman, Adam - Resume (Company Name).pdf`


https://github.com/user-attachments/assets/5f68c57c-87c1-40a2-9b2e-92be5afca20a



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

<img width="1723" height="835" alt="Screenshot 2026-02-05 at 11 48 19 AM" src="https://github.com/user-attachments/assets/962da7cf-8965-4077-bd7e-44bcf22e0dd1" />

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
