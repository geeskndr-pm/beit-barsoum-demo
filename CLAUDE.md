# Beit Barsoum WhatsApp Bot — Project Rules

## What this is
Freelance project for George's cousin Rouby (Beit Barsoum, Cairo). Build a WhatsApp AI bot that answers customer questions (workshops, pricing, availability, booking), handles English/Arabic/Franko-Arabic, and escalates to human when needed.

## Client
- **Business**: Beit Barsoum — jewelry workshops + handmade jewelry, established 1942
- **Website**: https://beitbarsoum.com
- **Client name**: Rouby
- **Fee**: 7000 EGP (George's revenue)

## Project goals
1. WhatsApp bot with AI knowledge base (workshop Q&A, pricing, booking flow)
2. Trilingual: English, Arabic, Franko-Arabic
3. Human handover trigger + notification to Rouby
4. Demo mockup customized with real Beit Barsoum data
5. Quote doc for Rouby: setup cost + monthly running cost

## Tech stack (decided)
- **WhatsApp**: Meta WhatsApp Cloud API (free tier: 1000 conversations/month)
- **Orchestration**: n8n (self-hosted on $5/month VPS)
- **AI**: Claude Haiku via Anthropic API (RAG over knowledge base)
- **Knowledge base**: Markdown file, loaded as system prompt context
- **Human handover**: n8n webhook → WhatsApp message to Rouby's personal number

## Directory layout
- `docs/knowledge-base.md` — all Beit Barsoum content (scraped + expanded)
- `docs/BRIEF.md` — project brief and decisions
- `docs/STATUS.md` — current state, updated each session
- `docs/QUOTE.md` — client-facing quote
- `demo/` — HTML mockup showing bot conversations
- `src/` — actual bot code (n8n workflow JSON + system prompt)

## Session hygiene
- Update `docs/STATUS.md` at end of each session
- Run `/handover` before closing
- Knowledge base is the source of truth — update it when Rouby gives new info
