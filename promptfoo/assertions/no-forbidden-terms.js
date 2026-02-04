const fs = require('fs');
const path = require('path');

// Extract JSON from output that may contain text before/after the JSON
function extractJson(output) {
  // Try parsing as-is first
  try {
    return JSON.parse(output);
  } catch {
    // Find JSON object in the text
    const match = output.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    return null;
  }
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

  // Load forbidden terms from file
  const termsFile = path.join(process.cwd(), 'promptfoo', 'forbidden-terms.txt');
  const termsContent = fs.readFileSync(termsFile, 'utf-8');
  const forbiddenTerms = termsContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((term) => term.toLowerCase());

  // Use word boundary matching to avoid false positives (e.g., "scala" in "scalable")
  const found = forbiddenTerms.filter((term) => {
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(allBulletText);
  });

  if (found.length > 0) {
    return {
      pass: false,
      score: 0,
      reason: `Found forbidden terms: ${found.join(', ')}`,
    };
  }

  // Return true for passing - promptfoo accepts boolean for pass
  return true;
};
