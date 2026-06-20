# Status — Beit Barsoum WhatsApp Bot
_Updated: 2026-06-20_

## Current phase
**Session 2 — Knowledge Base Fill**

## Done
- [x] Project directory created at `04-Code/beit-barsoum-bot/`
- [x] Website scraped, knowledge base seeded
- [x] BRIEF.md with tech stack decisions + pricing
- [x] CLAUDE.md for project sessions
- [x] HTML demo mockup — `demo/whatsapp-bot-demo.html` (5 scenarios: EN, AR, Franko-AR, booking, handover)
- [x] Knowledge base updated with: Make a Ring (LE 3,400), One Day Ring (LE 900), Gouache Rendering (LE 3,900), location (Fustat, Cairo)
- [x] Earrings workshop → escalate to human (no data available)

## Blocked / needs Rouby input
- Earrings Workshop: price, dates, duration (not on website)
- WhatsApp Business number (required to connect Meta API)
- Facebook Business Manager account status
- Cancellation/refund policy text
- Social media handles
- Active promotions / discount codes
- ~~Preferred language for handover notifications~~ ✓ English

## Architecture decisions (this session)
- Dropped n8n — replaced with lightweight Express.js server
- Dropped static KB for workshop data — Shopify Storefront API feeds live prices/dates/availability
- Static KB retained for policies, FAQs, evergreen content
- Confirmed Rouby is male

## Next session priorities
1. Build system prompt (trilingual, Shopify-context-injected, JSON handover flag)
2. Build Express.js webhook server (receive → call Claude + Shopify → reply → handover branch)
3. Draft QUOTE.md for Rouby (client-facing deliverable)
4. Collect missing info from Rouby (see HTML demo checklist)
