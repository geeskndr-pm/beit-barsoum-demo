# Project Brief — Beit Barsoum WhatsApp Bot

## The Problem
Rouby (Beit Barsoum) receives high volume of WhatsApp customer questions:
- When is the next workshop?
- What's included?
- Can I bring a friend?
- How do I book / pay?

Manual replies at scale = time drain for a small startup.

## The Solution
A WhatsApp AI bot that:
1. Answers FAQs instantly from a knowledge base
2. Handles English, Arabic, Franko-Arabic (e.g. "3ayza a3raf el price")
3. Guides customers through the booking flow
4. Detects when a human is needed and pings Rouby

## Scope of Work

### George delivers:
- [ ] Tech stack setup (WhatsApp API + Express.js server + Claude)
- [ ] Shopify Storefront API integration (live workshop data)
- [ ] Static knowledge base (policies, FAQs, brand content)
- [ ] Conversation flows (Q&A, booking, escalation)
- [ ] Trilingual prompt engineering
- [ ] Human handover webhook → Rouby notification (WhatsApp)
- [ ] HTML demo mockup (customized to Beit Barsoum)
- [ ] Quote doc for Rouby (setup + monthly running cost)
- [ ] Deployment + handover doc

### Not in scope (v1):
- Payment processing
- CRM / customer tracking
- Real-time booking availability beyond what Shopify exposes (Shopify handles this)

## Tech Stack Decisions

| Layer | Choice | Why |
|-------|--------|-----|
| WhatsApp access | Meta WhatsApp Cloud API | Free tier (1000 conv/month), no BSP middleman |
| Orchestration | Express.js server (self-hosted) | Lightweight, no extra tools, easy to maintain |
| AI | Claude Haiku (Anthropic API) | Best Arabic + Egyptian dialect support |
| Workshop data | Shopify Storefront API (live) | Prices, dates, availability always in sync with the website — zero maintenance |
| Static KB | Markdown file → system prompt | Policies, FAQs, evergreen content Rouby rarely changes |
| Hosting | $5/month DigitalOcean VPS | Runs the bot server, minimal footprint |
| Human handover | Bot → WhatsApp API message to Rouby | Direct, no extra service |

## Pricing for Rouby

### Setup fee (one-time)
| Item | Cost |
|------|------|
| George's setup labor | Included in 7,000 EGP |
| Meta WhatsApp Business API setup | Free (but needs Facebook Business Manager account) |
| DigitalOcean VPS (1 month prepaid) | ~250 EGP |
| **Total one-time to George** | **7,000 EGP** |

### Monthly running cost (Rouby pays directly)
| Item | Estimated monthly | Notes |
|------|------------------|-------|
| DigitalOcean VPS ($5) | ~250 EGP | Runs the bot server |
| Anthropic API (Claude Haiku) | ~100–300 EGP | Depends on volume; ~500 msgs/month = ~100 EGP |
| WhatsApp Cloud API | Free up to 1000 service conversations/month | Beyond that: ~$0.02–0.05/conv |
| **Total monthly** | **~350–600 EGP/month** | |

### What Rouby gets
- Bot answers customer questions 24/7 automatically
- Works in English, Arabic, and Franko-Arabic
- Workshop prices, dates, and availability always in sync with his Shopify store — no manual updates needed
- Notifies Rouby when customer wants a human
- Setup docs + 1 month support

## Timeline (draft)
- Week 1: Knowledge base fill + n8n workflow + system prompt
- Week 2: Testing (EN/AR/Franko-AR) + human handover
- Week 3: Demo + quote doc + delivery to Rouby

## Open Questions for Rouby
1. Exact WhatsApp Business number (need to connect to API)
2. Does he have a Facebook Business Manager account?
3. ~~Full list of workshops with accurate prices + dates~~ ✓ resolved — Make a Ring (LE 3,400), One Day Ring (LE 900), Gouache Rendering (LE 3,900) filled in from website. Earrings workshop still missing — bot will escalate to human.
4. Refund/cancellation policy text
5. ~~Location address~~ ✓ resolved — Beit Barsoum, Fustat, Cairo
6. Social media handles
7. Any specific promotions or discount codes active?
8. ~~Preferred language for Rouby's own handover notifications (EN or AR)?~~ ✓ resolved — English
9. Earrings Workshop — price, dates, duration (not on website)
