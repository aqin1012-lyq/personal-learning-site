# Publish Checklist

## Product positioning

- [ ] `src/data/site.ts` has been replaced with your real site name, description, author, and domain
- [ ] `src/data/about.ts` reflects your real learning direction and not the default placeholder text
- [ ] `src/data/current-learning.ts` reflects your real current focus

## Content readiness

- [ ] At least 3 logs are published
- [ ] At least 3 notes are published
- [ ] At least 1 project is published
- [ ] Empty states still look reasonable if some sections are still sparse

## Technical checks

- [ ] `npm install` succeeds on a fresh machine
- [ ] `npm run build` passes
- [ ] `npm run new:log`, `npm run new:note`, and `npm run new:project` work as expected
- [ ] `/studio` can create new content without errors
- [ ] `siteUrl` points to the real deployed domain

## Share and SEO basics

- [ ] `public/og-default.svg` matches the current branding
- [ ] `public/favicon.svg` is acceptable as a temporary or final favicon
- [ ] Metadata renders correctly for home, logs, notes, and projects
- [ ] `robots.txt` and `sitemap.xml` point to the correct domain

## Release packaging

- [ ] README is updated with the latest screenshots or demo link
- [ ] Repo description on GitHub matches the product positioning
- [ ] A public demo URL is available
- [ ] First-wave launch copy is drafted
- [ ] You know where you will post first (X, 即刻, 小红书, GitHub, etc.)
