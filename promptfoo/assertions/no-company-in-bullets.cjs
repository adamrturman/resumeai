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

module.exports = (output) => {
  const data = extractJson(output);
  if (!data) {
    return {
      pass: false,
      score: 0,
      reason: 'Could not extract valid JSON from output',
    };
  }

  const companyName = data.companyName;

  if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
    return true;
  }

  const bullets = data.bullets || {};
  const allBulletText = Object.values(bullets).flat().join(' ');

  if (matchesWordBoundary(allBulletText, companyName.trim())) {
    return {
      pass: false,
      score: 0,
      reason: `Company name "${companyName}" should not appear in bullet points`,
    };
  }

  return true;
};
