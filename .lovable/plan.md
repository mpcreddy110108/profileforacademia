# Role-based accounts and separate dashboards

## What changes for people using the app

- **Signing up** now asks: are you a Student, a Recruiter, or an Institution? The choice is saved with the account.
- **After signing in**, each person lands on their own home page: students on the competency hub, recruiters on the recruiter dashboard, institutions on the analytics dashboard.
- **Wrong doors are locked.** If someone types in an address that belongs to another kind of account, they are sent straight back to their own home page.
- **The "View As" switcher is removed.** The side menu now shows only the pages that belong to the signed-in person's role.

## The three dashboards

**Student (/)** — unchanged content: profile, readiness score, evidence, skill gaps, learning path, matched opportunities, applications, privacy.

**Recruiter (/recruiter)** — new landing page with a summary of posted roles and top candidate matches, plus links to the existing posting form and candidate shortlist pages.

**Institution (/institution)** — cohort analytics, a student list with readiness scores, and skill demand vs supply. Mentor verification stays available to this role.

## Technical notes

- Roles already exist in the `user_roles` table and are created automatically on signup from the account's metadata; the signup form will pass `role` in `signUp` options so the existing trigger stores it. No schema change needed.
- Onboarding stays student-only; recruiter and institution accounts skip it and go to their dashboard.
- `src/components/AppShell.tsx` gains an `allow` prop naming the roles permitted on that page. It redirects to the role's home when the signed-in role is not allowed, builds the nav list from the role, and drops the persona switcher.
- New route `src/routes/recruiter.index.tsx` for `/recruiter`; existing `/recruiter/post`, `/recruiter/candidates`, `/institution`, `/mentor` get the matching `allow` values, and all student pages get `allow={["student"]}`.
- `src/routes/auth.tsx` gains a role selector shown in signup mode; redirect after sign-in uses the role from the store.
- Scoring, evidence, and matching logic are untouched.
