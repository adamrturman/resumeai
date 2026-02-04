import { writeFileSync } from 'fs';
import { join } from 'path';
import { baseResume } from '../src/data/baseResume';

const OUTPUT_PATH = join(process.cwd(), 'promptfoo', 'resume-data.txt');

function generateResumeData(): void {
  const skills = baseResume.technicalSkills.map((s) => s.name).join(', ');

  let output = `AVAILABLE SKILLS (select from this list):
${skills}

WORK EXPERIENCE BULLETS BY ROLE:
`;

  for (const job of baseResume.workExperience) {
    output += `\n${job.title}:\n`;
    for (const bullet of job.highlights) {
      output += `- ${bullet}\n`;
    }
  }

  writeFileSync(OUTPUT_PATH, output.trim() + '\n');
  console.log(`Generated ${OUTPUT_PATH}`);
}

generateResumeData();
