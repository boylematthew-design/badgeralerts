# BadgerAlerts — Claude Instructions

## What this project is

BadgerAlerts is an AI-powered digital marketing monitoring SaaS. It watches a user's website and digital presence and fires alerts across SEO, social media, competitors, content strategy, and paid media.

The full project plan is saved at `prototype/projectplan.pdf`.

## Shared data & components

- **Footer links** — stored once in `lib/footer-links.ts`. Both `components/Footer.tsx` (homepage) and `components/DashboardFooter.tsx` (dashboard) import from it. To add/change/remove a footer link, **only edit `lib/footer-links.ts`** — never edit the footer components directly for link changes.

## Tech stack (agreed)

- **Framework:** Next.js (App Router) + React + Tailwind CSS
- **Database, Auth & Storage:** Supabase (PostgreSQL + Auth + Storage buckets)
- **Email:** Resend (event-triggered emails, simple Next.js integration)
- **Admin panel:** Protected `/admin` route built inside Next.js (no separate CMS needed)

## The 4 main sections of the build

### 1.0 — Registering a user

- Landing page has a signup form: website URL, full name, email, password
- URL must be valid (accepts with or without www, rejects malformed)
- On submit: user stored in Supabase Auth + `users` table
- Confirmation email sent — user must verify before they are active
- Unconfirmed users are hidden/excluded
- Duplicate emails and duplicate websites are blocked

### 2.0 — Creating posts (alerts) in the backend

- Admin creates alerts ("posts") via a protected `/admin` page
- Each alert has: title, description, images (stored in Supabase Storage)
- Alerts stored in a `posts` table in Supabase
- "Posts" = "Alerts" — same thing, used interchangeably

### 3.0 — Assigning & scheduling posts to users

- Admin views users and assigns posts to specific users
- Each assignment has a checkbox + date/time selector (GMT)
- Posts go live and appear in the user's dashboard at the scheduled time
- Stored in a `user_posts` join table (links users to posts with a scheduled date)

### 4.0 — Notifying the user via email

- When a scheduled post goes live, user receives an email via Resend
- Email subject = post title
- Email body = post title + CTA button to login and read
- Email design matches BadgerAlerts brand
- Users can unsubscribe from all emails
- Users can manage settings and delete their account from the dashboard

## Design system

- Font: Plus Jakarta Sans (via Google Fonts)
- CSS framework: Tailwind
- Sidebar background: slate-950
- Primary accent: emerald-500
- Background: slate-50 / #eff4fb
- Cards: white, rounded-2xl or rounded-3xl, subtle border + shadow
- Brand name: **BadgerAlerts** (always — never "BadgerBuild")

## How to work with this user

- Beginner coder — strong digital marketing background, comfortable with HTML, some CSS, learning JavaScript
- Break all instructions down as 1.1, 1.2, 1.3 etc matching the section number
- One section at a time — don't overload
- Explain the _why_ behind decisions, not just the code
- Offer suggestions and flag potential issues proactively
- **Coach on commercial best practices** — this project is intended to ship commercially. When making architectural decisions (e.g. shared data files, component structure), briefly explain *why* it's the right approach for a real product, not just that it works. Help the user build good habits.

## Security — CRITICAL, DO NOT SKIP

The user does not have a deep security background. This means **I must proactively flag every security consideration** before we take any action — not after, not when asked. If a step has a security implication, stop and explain it first.

This includes but is not limited to:
- **Row Level Security (RLS)** — must be enabled on every Supabase table, every time, no exceptions
- Authentication — always use Supabase Auth, never roll custom auth
- Environment variables — API keys must never be hardcoded, always use .env.local
- Input validation — validate all user inputs on the server, not just the client
- Duplicate prevention — emails and websites must be unique in the database
- Unconfirmed users — must be excluded from all data access until email is verified
- Admin routes — must be protected and never accessible to regular users

**If I ever proceed through a security-relevant step without flagging it first, the user should call it out and I must update this file immediately.**
