# Release Notes v0.1

## Theme

This release turns the project from a personal learning site into the first public-ready version of a reusable template product.

## What changed

### Productization
- clarified product positioning across homepage, navbar, footer, and README
- added onboarding guidance for first-time template users
- improved empty states so sparse content still feels intentional

### Content workflow
- added template files for logs, notes, and projects
- added command-line scaffolding:
  - `npm run new:log`
  - `npm run new:note`
  - `npm run new:project`
- expanded `/studio` so users can create logs, notes, and projects directly

### Content system
- replaced custom frontmatter parsing with `gray-matter`
- added required-field validation for logs, notes, and projects
- added date format validation
- added duplicate file protection for generated content

### Share and launch readiness
- improved page metadata for logs, notes, and projects
- added default OG image
- added favicon and manifest wiring
- added launch assets and publishing checklist

## Files added for launch prep
- `PUBLISH_CHECKLIST.md`
- `LAUNCH_COPY_DRAFT.md`
- `public/og-default.svg`
- `public/repo-social-card.svg`
- `public/favicon.svg`

## Suggested next step

Use this version as the first public template release, then gather feedback from:
- developers learning in public
- AI learners
- long-term self-learners building personal knowledge systems
