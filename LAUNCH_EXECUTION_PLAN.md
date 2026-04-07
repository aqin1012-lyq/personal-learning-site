# Launch Execution Plan

## Goal

Ship the first public version of the template as a reusable product, not just a personal repo.

## Launch order

### Step 1. Final repo polish
- update GitHub repo description
- add recommended GitHub topics
- pin the demo URL in README if available
- confirm README matches the live product positioning

### Step 2. Demo readiness
- deploy a public demo
- verify home, logs, notes, projects, and studio all render correctly
- verify social preview image and favicon work on the deployed URL

### Step 3. Content readiness
- keep enough content in the demo to make the system understandable
- ensure there are at least:
  - 3 logs
  - 3 notes
  - 1 project

### Step 4. Technical verification
- run `npm install`
- run `npm run build`
- run `npm run new:log`
- run `npm run new:note`
- run `npm run new:project`
- verify `/studio` can publish content locally

### Step 5. First-wave launch post
Post in this order:
1. GitHub repository live
2. primary social post (X / 即刻 / 小红书, choose one first)
3. follow-up explanation thread or long-form post
4. ask early users for feedback or showcases

## Recommended first launch message angle

Do not lead with tech stack.

Lead with:
- this is a personal learning system template
- it connects logs, notes, and projects
- it helps long-term learners build a public learning interface

## Success signals to watch

- GitHub stars are useful but secondary
- stronger signals:
  - repo visits
  - README-to-demo clicks
  - demo-to-template usage
  - first users publishing their own content
  - people saying “this is exactly the structure I needed”

## After launch

Within 24-72 hours:
- collect confusion points from first visitors
- track where people stop during onboarding
- identify whether they understand Logs / Notes / Projects quickly
- update README and onboarding copy fast based on real questions
