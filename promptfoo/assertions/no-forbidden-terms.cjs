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

function loadForbiddenTerms() {
  const termsFile = path.join(process.cwd(), 'promptfoo', 'forbidden-terms.txt');
  const termsContent = fs.readFileSync(termsFile, 'utf-8');
  return termsContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((term) => term.toLowerCase());
}

module.exports = (output) => {
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

  const forbiddenTerms = loadForbiddenTerms();

  const found = forbiddenTerms.filter((term) =>
    matchesWordBoundary(allBulletText, term)
  );

  if (found.length > 0) {
    return {
      pass: false,
      score: 0,
      reason: `Found forbidden terms: ${found.join(', ')}`,
    };
  }

  return true;
};
