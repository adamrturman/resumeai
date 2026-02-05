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

  const companyName = data.companyName;

  // If no company name extracted, pass the test (nothing to check)
  if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
    return true;
  }

  const bullets = data.bullets || {};
  const allBulletText = Object.values(bullets).flat().join(' ');

  // Use word boundary regex for case-insensitive matching of the full company name
  const escapedCompanyName = companyName
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escapedCompanyName}\\b`, 'i');

  if (regex.test(allBulletText)) {
    return {
      pass: false,
      score: 0,
      reason: `Company name "${companyName}" should not appear in bullet points`,
    };
  }

  return true;
};
