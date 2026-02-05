const fs = require('fs');
const path = require('path');

function extractJson(output) {
  try {
    return JSON.parse(output);
  } catch {
    const match = output.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchesWordBoundary(text, term) {
  const regex = new RegExp(`\\b${escapeRegex(term)}\\b`, 'i');
  return regex.test(text);
}

function extractSkillsFromBaseResume() {
  const resumeFile = path.join(process.cwd(), 'src', 'data', 'baseResume.ts');
  const content = fs.readFileSync(resumeFile, 'utf-8');

  const skillMatches = content.match(/{\s*name:\s*['"]([^'"]+)['"]/g) || [];

  return skillMatches
    .map((match) => {
      const nameMatch = match.match(/name:\s*['"]([^'"]+)['"]/);
      return nameMatch ? nameMatch[1].toLowerCase() : null;
    })
    .filter((skill) => skill !== null);
}

module.exports = (output, context) => {
  const data = extractJson(output);
  if (!data) {
    return {
      pass: false,
      score: 0,
      reason: 'Could not extract valid JSON from output',
    };
  }

  const bullets = data.bullets || {};
  const allBulletText = Object.values(bullets).flat().join(' ').toLowerCase();

  const baseResumeTerms = extractSkillsFromBaseResume();

  const jobDescription = (context.vars?.jobDescription || '').toLowerCase();

  const termsInJobDescription = baseResumeTerms.filter((term) =>
    matchesWordBoundary(jobDescription, term)
  );

  if (termsInJobDescription.length === 0) {
    return true;
  }

  const missingTerms = termsInJobDescription.filter(
    (term) => !matchesWordBoundary(allBulletText, term)
  );

  if (missingTerms.length > 0) {
    return {
      pass: false,
      score: 0,
      reason: `Job description mentions these skills from your resume, but they're missing from bullets: ${missingTerms.join(', ')}`,
    };
  }

  return true;
};
