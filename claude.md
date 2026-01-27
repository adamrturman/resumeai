# Resume AI - Project Conventions

## Overview
Single-page app that generates customized resumes from job descriptions using AI, with safeguards against hallucinating skills. Outputs PDF with format: `Turman, Adam - Resume (Company Name).pdf`

## Tech Stack
- React 19 + Vite + TypeScript
- OpenAI API (swappable architecture) - mocked initially with lorem ipsum
- Plain CSS
- Vitest + React Testing Library (TDD)
- ESLint + Prettier (code style)

## Development Approach

### Test-Driven Development
- Write tests first, then implementation
- Use semantic HTML queries: role, label, text
- No data-testid attributes

### Conventional Commits
- `feat:` new feature
- `fix:` bug fix
- `test:` adding tests
- `chore:` maintenance/config
- `docs:` documentation
- `style:` styling changes

### Code Style
- Minimal comments (only for edge cases or unclear logic)
- Prefer editing existing files over creating new ones
- No emojis unless explicitly requested

## Testing Patterns

```typescript
// Query by role (semantic) - preferred
screen.getByRole('textbox', { name: /job description/i })
screen.getByRole('button', { name: /generate/i })

// Not this (no data-testid)
screen.getByTestId('job-input') // never use
```

## File Structure
```
src/
├── components/     # React components with co-located tests/styles
├── services/       # AI providers, resume builder, PDF generation
├── data/          # Type definitions and static data
├── hooks/         # Custom React hooks
├── config/        # Configuration files
└── test/          # Test setup
```

## Commands
- `npm run dev` - Start dev server
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier
- `npm run build` - Build for production
