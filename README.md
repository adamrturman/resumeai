# ResumeAI: A Case Study in Prompt Engineering with Promptfoo

## The Problem: LLMs Lie on Resumes

People increasingly use LLMs to customize application materials—resumes, cover letters, outreach emails. This makes sense: the task is repetitive, high-stakes, and benefits from tailoring. But there's a critical failure mode that can tank your candidacy:

**Skill hallucination.**

I've personally encountered LLMs that:
- Invented skills I don't have ("5+ years of COBOL experience")
- Explicitly named the target company in resume bullets ("Developed solutions optimized for Acme Corp")
- Fabricated achievements that never happened

These aren't minor issues. A recruiter finding skills on your resume that you can't demonstrate in an interview is an instant rejection. Mentioning the company name in your work history is bizarre at best, disqualifying at worst.

## The Approach: Test-Driven Prompt Engineering

Rather than iterating on prompts through vibes, I applied the same methodology I use for code: **write a failing test first, then make it pass.**

Promptfoo makes this workflow possible. It treats prompts as testable artifacts with measurable behavior, not mystical incantations to be tweaked until they "feel right."

### Intentionally Choosing a Weak Model

I deliberately used `ollama:llama3.2`—a small, locally-run model—rather than GPT-4 or Claude. Why?

1. **Establishes a meaningful baseline.** Starting with scores in the 50-70% range creates room to demonstrate improvement.
2. **Stress-tests the prompt.** If a prompt can constrain a weaker model, it will work even better with stronger ones.
3. **Mirrors real constraints.** Cost, latency, and privacy requirements often push production systems toward smaller models.

The goal wasn't to achieve 100% with a flagship model—that proves nothing about prompt quality. The goal was to show that **prompt engineering alone** can meaningfully improve output quality.

## The Experiment: V1 vs V2

### Test Case: The Mainframe Trap

```yaml
- vars:
    jobDescription: "Legacy Systems Developer at MainframeCorp. Required:
      5+ years experience in COBOL, JCL, and mainframe development.
      Must have expertise in batch processing and VSAM file handling."
  assert:
    - type: is-json
    - type: javascript
      value: |
        const skills = JSON.parse(output).technicalSkills || [];
        const hasOnlyValidSkills = skills.every(skill =>
          ["JavaScript (ES6+)", "TypeScript", "React", "Python", "Git",
           "Jest", "CI/CD", "Vite", "RESTful APIs", "HTML5", "CSS3",
           "Agile/Scrum", "Vitest", "Playwright", "GitHub Actions"].includes(skill)
        );
        return hasOnlyValidSkills;
```

This test presents a job description asking for skills the candidate **doesn't have**. The assertion verifies that every skill in the output comes from the allowed whitelist. Any hallucinated skill (COBOL, JCL, Mainframe, VSAM) fails the test.

### Prompt V1: Implicit Guardrails (Fails)

V1 uses standard instructional language:

```
AVAILABLE SKILLS (select 8-12 from this list, prioritizing those relevant to the job):
JavaScript (ES6+), TypeScript, React, Python, Git, Jest, CI/CD, Vite,
RESTful APIs, HTML5, CSS3, Agile/Scrum, Vitest, Playwright, GitHub Actions
```

The instruction is clear to a human: only pick from this list. But weaker models often ignore it, especially when the job description repeatedly emphasizes unfamiliar technologies.

### Prompt V2: Explicit Guardrails with Negative Example (Passes)

V2 adds a `CRITICAL RULES` section with a concrete negative example:

```
CRITICAL RULES:
- ONLY use skills from the AVAILABLE SKILLS list below. Never invent skills I don't have.
- If the job requires skills not in my list, select the closest relevant skills I DO have instead.

EXAMPLE OF WHAT NOT TO DO:
If the job asks for "COBOL, JCL, mainframe experience", do NOT output:
  "technicalSkills": ["COBOL", "JCL", "Mainframe"]  ← WRONG! These are not in my skills list.
Instead, output relevant skills I actually have:
  "technicalSkills": ["Python", "CI/CD", "Git"]  ← CORRECT! These are from my actual skills list.
```

The key insight: **showing the model what failure looks like** is more effective than simply stating the rule.

## Why This Matters

### For Job Seekers
LLM-assisted job applications are becoming standard. But without guardrails, you're essentially letting the model fabricate your qualifications. Having empirical evidence that your prompt prevents hallucination—not just hoping it does—is the difference between a tool and a liability.

### For Prompt Engineers
This project demonstrates a workflow:

1. **Identify failure modes** (skill hallucination, company name insertion)
2. **Write assertions that catch them** (whitelist validation, regex checks)
3. **Iterate on prompts with evidence** (V1 fails, V2 passes)
4. **Use weak models to stress-test** (if it works on llama3.2, it'll work on GPT-4)

### For Promptfoo Specifically
This is exactly the use case Promptfoo is built for: bringing software engineering rigor to prompt development. The red-to-green refactor pattern—failing test, fix, passing test—works just as well for prompts as it does for code.

## Running the Evaluation

```bash
# Install dependencies
npm install

# Run Promptfoo evaluation
npm run promptfoo

# View results in browser
npm run promptfoo:view
```

Requires [Ollama](https://ollama.ai/) running locally with the `llama3.2` model pulled.

## Project Structure

```
promptfoo/
├── prompt-v1.txt          # Baseline prompt (implicit guardrails)
├── prompt-v2.txt          # Improved prompt (explicit negative examples)
promptfooconfig.yaml       # Test configuration and assertions
```

## Key Takeaways

1. **Negative examples outperform negative instructions.** "Don't do X" is weaker than "Here's what X looks like, don't do that."

2. **Weak models are better test subjects.** They expose prompt weaknesses that stronger models might paper over.

3. **Assertions make prompts testable.** Without Promptfoo, I'd be manually checking outputs and hoping I caught all the edge cases.

4. **High-stakes applications need guardrails.** Resume generation isn't a creative writing task—accuracy is non-negotiable.

---
