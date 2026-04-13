# Q&A

## How should participants select their tenant on mobile?

Good question. A few common patterns, roughly from most to least friction:

**QR Code scan** — the studio/school generates a QR code (from their admin dashboard) that encodes the `tenantId`. Participant opens the app, scans it, done. Zero typing, hard to get wrong. Works great for physical locations (printed on the wall, front desk, welcome email). This is probably the best fit for a dance studio context.

**Subdomain / deep link** — the studio shares a link like `wbs://join/a50834f8` or a web URL that opens the app with the tenant pre-selected. Good for onboarding via email/WhatsApp. Can be combined with QR (the QR just encodes the link).

**Short join code** — tenant gets a short human-readable code (e.g. `RHYTHM-42`). Participant types it in. Lower friction than a UUID, works offline. Duolingo and many class-based apps use this.

**Search by name** — participant searches "Rhythm Dance Studio Berlin", picks from a list. Familiar UX (like choosing a bank in open banking apps), but requires a tenant directory and network access.

**Invite-only** — no selection at all. Studio sends a magic link that pre-registers the participant with the correct `tenantId`. The cleanest UX but requires the studio to initiate every signup.

---

**Recommendation: QR + deep link**

- QR encodes a universal link: `https://app.wbs.com/join?tenant=<id>`
- If the app is installed, it opens directly with the tenant set
- If not, it goes to a web landing page / app store
- Studio can print the QR code or embed it in a welcome email

This is what fitness apps like Mindbody and ClassPass effectively do for studio onboarding. It requires no typing, works for non-tech-savvy participants, and the studio controls distribution.

The short join code is a good fallback for when someone needs to type it in manually (e.g. over the phone).
