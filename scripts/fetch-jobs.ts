import Firecrawl from '@mendable/firecrawl-js';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import 'dotenv/config';

const firecrawl = new Firecrawl({
  apiKey: process.env.VITE_FIRECRAWL_API_KEY,
});

const JOBS_DIR = join(process.cwd(), 'promptfoo', 'jobs');
const JOBS_PER_QUERY = 2;

// Target specific job posting platforms with actual job descriptions
const SEARCH_QUERIES = [
  'site:boards.greenhouse.io senior software engineer responsibilities',
  'site:jobs.lever.co frontend engineer qualifications',
  'site:jobs.ashbyhq.com react developer requirements',
  'site:boards.greenhouse.io backend engineer about the role',
  'site:jobs.lever.co full stack engineer what you will do',
];

interface SearchResultItem {
  url?: string;
  title?: string;
  description?: string;
  markdown?: string;
  metadata?: {
    title?: string;
    ogSiteName?: string;
  };
}

interface SearchResponse {
  success?: boolean;
  data?: SearchResultItem[];
  web?: SearchResultItem[];
}

function sanitizeFilename(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)
    .replace(/-$/, '');
}

function extractCompanyFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;

    // Handle common job board URL patterns
    // greenhouse.io: boards.greenhouse.io/companyname or companyname.greenhouse.io
    if (hostname.includes('greenhouse.io')) {
      if (hostname.startsWith('boards.')) {
        const match = pathname.match(/^\/([^/]+)/);
        return match ? match[1] : 'unknown';
      }
      return hostname.split('.')[0];
    }

    // lever.co: jobs.lever.co/companyname
    if (hostname.includes('lever.co')) {
      const match = pathname.match(/^\/([^/]+)/);
      return match ? match[1] : 'unknown';
    }

    // ashbyhq.com: jobs.ashbyhq.com/companyname
    if (hostname.includes('ashbyhq.com')) {
      const match = pathname.match(/^\/([^/]+)/);
      return match ? match[1] : 'unknown';
    }

    // Fallback: use hostname
    const parts = hostname.replace('www.', '').split('.');
    return parts[0] || 'unknown';
  } catch {
    return 'unknown';
  }
}

function extractPositionFromTitle(title: string): string {
  // Clean up common patterns in job titles
  let cleaned = title
    .replace(/\s*[-|–—]\s*.*greenhouse.*$/i, '')
    .replace(/\s*[-|–—]\s*.*lever.*$/i, '')
    .replace(/\s*[-|–—]\s*.*ashby.*$/i, '')
    .replace(/\s*[-|–—]\s*.*careers?.*$/i, '')
    .replace(/\s*at\s+\w+$/i, '')
    .trim();

  // If still has separators, take the first part
  cleaned = cleaned.split(/[|\-–—]/)[0].trim();

  return cleaned || 'Software Engineer';
}

function isValidJobDescription(markdown: string, title: string): boolean {
  const lowercaseContent = markdown.toLowerCase();
  const lowercaseTitle = title.toLowerCase();

  // Skip error/404 pages
  if (lowercaseContent.includes("couldn't find anything") || lowercaseContent.includes('404 error')) {
    return false;
  }

  // Skip job listing pages (multiple jobs, not a single job description)
  if (
    lowercaseTitle.includes('view jobs') ||
    lowercaseTitle.includes('all jobs') ||
    lowercaseContent.includes('showing') && lowercaseContent.includes('results')
  ) {
    return false;
  }

  // Should have typical job description keywords
  const hasJobKeywords =
    lowercaseContent.includes('responsibilities') ||
    lowercaseContent.includes('qualifications') ||
    lowercaseContent.includes('requirements') ||
    lowercaseContent.includes('about the role') ||
    lowercaseContent.includes('what you') ||
    lowercaseContent.includes('we are looking for');

  return hasJobKeywords;
}

async function fetchJobs(): Promise<void> {
  console.log('Fetching jobs using Firecrawl...');

  if (!process.env.VITE_FIRECRAWL_API_KEY) {
    throw new Error('VITE_FIRECRAWL_API_KEY not found in environment');
  }

  if (!existsSync(JOBS_DIR)) {
    mkdirSync(JOBS_DIR, { recursive: true });
  }

  let totalSaved = 0;

  for (const query of SEARCH_QUERIES) {
    console.log(`\nSearching: "${query}"`);

    try {
      const searchResult = (await firecrawl.search(query, {
        limit: JOBS_PER_QUERY,
        scrapeOptions: {
          formats: ['markdown'],
        },
      })) as SearchResponse;

      // Handle both possible response structures
      const results = searchResult.data || searchResult.web || [];

      if (results.length === 0) {
        console.log(`  No results for query`);
        continue;
      }

      console.log(`  Found ${results.length} results`);

      for (const result of results) {
        const url = result.url || '';
        const title = result.title || result.metadata?.title || '';
        const markdown = result.markdown || '';

        if (!url || !markdown || markdown.length < 200) {
          console.log(`  Skipping result - insufficient content (markdown: ${markdown.length} chars)`);
          continue;
        }

        if (!isValidJobDescription(markdown, title)) {
          console.log(`  Skipping result - not a valid job description`);
          continue;
        }

        const company = result.metadata?.ogSiteName || extractCompanyFromUrl(url);
        const position = extractPositionFromTitle(title);

        const companySlug = sanitizeFilename(company);
        const positionSlug = sanitizeFilename(position);
        const filename = `${companySlug}-${positionSlug}.txt`;
        const filepath = join(JOBS_DIR, filename);

        if (existsSync(filepath)) {
          console.log(`  Skipping ${filename} (already exists)`);
          continue;
        }

        const content = `Company: ${company}
Position: ${position}
URL: ${url}

${markdown}`;

        writeFileSync(filepath, content);
        console.log(`  Saved ${filename}`);
        totalSaved++;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`  Error with query: ${message}`);
    }
  }

  console.log(`\nDone! Saved ${totalSaved} job files to promptfoo/jobs/`);
}

fetchJobs().catch((error) => {
  console.error('Error fetching jobs:', error.message);
  process.exit(1);
});
