# Matthew Boyle — Claude Instructions

## What this project is

This site is Matthew Boyle's personal digital marketing agency, blog, and tools platform — think a Neil Patel–style personal brand site (headline: consulting, services, free guides, and tools), not a standalone SaaS product.

It started life as **BadgerAlerts**, an AI-powered digital marketing monitoring SaaS (a tool that watches a user's website and fires alerts across SEO, social, competitors, content, and paid media). That product didn't take off as a standalone SaaS, so as of August 2026 it was pivoted into Matthew's agency site. The original monitoring tool still exists and works — it now lives under **`/tools`** as one offering of the agency ("Website Monitoring Tool"), rather than being the whole site. Domain stays `badgeralerts.live` for now (may change later).

Header nav: **Blog / Services / Tools / Consulting**, plus a LinkedIn icon (links to `https://www.linkedin.com/in/mattboyle3/`) and a "Work with me" button (links to `/contact`) in the top right.

The full original project plan is saved at `prototype/projectplan.pdf` (describes the pre-pivot SaaS build — still useful background on how `/tools`, `/admin`, and the alert-scheduling system work).

## Shared data & components

- **Footer links** — stored once in `lib/footer-links.ts`. Both `components/Footer.tsx` (homepage) and `components/DashboardFooter.tsx` (dashboard) import from it. To add/change/remove a footer link, **only edit `lib/footer-links.ts`** — never edit the footer components directly for link changes.

## Tech stack (agreed)

- **Framework:** Next.js (App Router) + React + Tailwind CSS
- **Database, Auth & Storage:** Supabase (PostgreSQL + Auth + Storage buckets)
- **Email:** Resend (event-triggered emails, simple Next.js integration)
- **Admin panel:** Protected `/admin` route built inside Next.js (no separate CMS needed)

## The 4 main sections of the `/tools` monitoring product

These describe the original BadgerAlerts SaaS mechanics, which still run under `/tools`, `/admin`, `/dashboard`, `/signup`, and `/login`.

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
- Email design matches the site brand
- Users can unsubscribe from all emails
- Users can manage settings and delete their account from the dashboard

## Responsive design — ALWAYS REQUIRED

Every page and component must work on mobile, tablet, and desktop. This is not optional — always build mobile-first. When working on any UI:
- Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) throughout
- Mobile is the default, desktop is the enhancement
- Test mentally at 375px (mobile), 768px (tablet), 1280px (desktop)
- Sidebars must collapse or hide on mobile
- Text sizes, spacing, and layouts must adapt at breakpoints
- Never leave a page that breaks or looks broken on small screens

## Design system

- Font: Plus Jakarta Sans (via Google Fonts)
- CSS framework: Tailwind
- Sidebar background: slate-950
- Primary accent: emerald-500
- Background: slate-50 / #eff4fb
- Cards: white, rounded-2xl or rounded-3xl, subtle border + shadow
- Brand name: **Matthew Boyle** (always — the site is a personal agency brand, not "BadgerAlerts", though the `/tools` monitoring product may still reference its original name internally)

## How to work with this user

- Beginner coder — strong digital marketing background, comfortable with HTML, some CSS, learning JavaScript
- Uses **PowerShell** as the terminal — never use `&&` to chain commands, always give them as separate commands
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
