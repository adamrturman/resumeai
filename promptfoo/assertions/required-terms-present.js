const fs = require('fs');
const path = require('path');

// Extract skill names from baseResume.ts by parsing the technicalSkills array
function extractSkillsFromBaseResume() {
  const resumeFile = path.join(process.cwd(), 'src', 'data', 'baseResume.ts');
  const content = fs.readFileSync(resumeFile, 'utf-8');

  // Match all { name: '...' } patterns in technicalSkills array
  const skillMatches = content.match(/{\s*name:\s*['"]([^'"]+)['"]/g) || [];

  return skillMatches
    .map((match) => {
      const nameMatch = match.match(/name:\s*['"]([^'"]+)['"]/);
      return nameMatch ? nameMatch[1].toLowerCase() : null;
    })
    .filter(Boolean);
}

module.exports = (output, context) => {
  let data;
  try {
    data = JSON.parse(output);
  } catch {
    return {
      pass: false,
      score: 0,
      reason: 'Output is not valid JSON',
    };
  }

  const bullets = data.bullets || {};
  const allBulletText = Object.values(bullets).flat().join(' ').toLowerCase();

  // Load skills from baseResume.ts
  const baseResumeTerms = extractSkillsFromBaseResume();

  // Get job description from context
  const jobDescription = (context.vars?.jobDescription || '').toLowerCase();

  // Find which base resume terms appear in the job description
  const termsInJobDescription = baseResumeTerms.filter((term) => {
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(jobDescription);
  });

  // If no base resume terms are in the job description, test passes (nothing to check)
  if (termsInJobDescription.length === 0) {
    return true;
  }

  // Check which required terms are missing from the output
  const missingTerms = termsInJobDescription.filter((term) => {
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return !regex.test(allBulletText);
  });

  if (missingTerms.length > 0) {
    return {
      pass: false,
      score: 0,
      reason: `Job description mentions these skills from your resume, but they're missing from bullets: ${missingTerms.join(', ')}`,
    };
  }

  return true;
};
