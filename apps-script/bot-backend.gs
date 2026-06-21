// ================================================================
// Beit Barsoum Bot — Test Backend (Google Apps Script)
// ================================================================
// SETUP (one-time, ~5 min):
//
// 1. Go to script.google.com → New project → paste this code
//
// 2. Get a FREE Gemini API key:
//    → aistudio.google.com → Get API key → Create (no billing needed)
//    → Copy the key
//
// 3. In Apps Script: Project Settings → Script Properties → Add:
//    Name: GEMINI_API_KEY  |  Value: (paste key)
//
// 4. Create a new Google Sheet, copy its ID from the URL:
//    https://docs.google.com/spreadsheets/d/[THIS PART]/edit
//    → Paste it as SHEET_ID below
//
// 5. Deploy → New deployment → Web App
//    Execute as: Me
//    Who has access: Anyone
//    → Copy the Web App URL
//
// 6. Paste the Web App URL into test-chat.html as BACKEND_URL
// ================================================================

const SHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';

const SYSTEM_PROMPT = `You are the WhatsApp customer assistant for Beit Barsoum, a Cairo-based jewelry workshop and handmade jewelry brand established in 1942.

YOUR ROLE: Answer customer questions about workshops, jewelry collections, booking, pricing, and location. Be warm, helpful, and concise. This is WhatsApp — keep replies short and conversational, not essay-length.

LANGUAGE RULES (critical):
- Detect the customer's language from their message
- Reply in EXACTLY the same language/style they used
- English message → English reply
- Arabic (عربي) → Egyptian dialect Arabic reply
- Franko-Arabic (e.g. "3ayza a3raf", "el price", "mawa3ed") → reply in Franko-Arabic using the same style (mix of English words and Arabic in Latin script, numbers like 3=ع, 7=ح, 2=ء)

KNOWLEDGE BASE RULES:
- Only state facts from the knowledge base below
- Never guess prices, dates, or policies not listed
- For the Earrings Workshop: say you don't have full details yet and offer to connect them with Rouby
- For anything missing: be honest, offer to connect with Rouby

HUMAN HANDOVER: If the customer is clearly frustrated, stuck after 2+ exchanges, or says "I want to speak to someone / 3ayez akallem had / أنا عايز أكلم حد", say: "I'll connect you with Rouby now — he'll get back to you shortly! 🤝" and stop answering.

BOOKING: Direct customers to beitbarsoum.com for booking and payment. Offer to have Rouby follow up for anything complex.

TONE: Warm, friendly, knowledgeable — like a helpful friend who loves jewelry, not a corporate helpdesk.`;

const KNOWLEDGE_BASE = `
# Beit Barsoum — Knowledge Base

## About
Beit Barsoum is a Cairo-based jewelry workshop and handmade jewelry brand, established in 1942. They offer hands-on jewelry-making workshops and handcrafted jewelry collections. They operate in Egypt and Qatar.

## Workshops

### 1. Introduction to Jewelry Making
- Price: LE 3,400
- Duration: 4 evenings, 6:00 PM – 9:00 PM each
- What you make: A pendant (entirely your own design)
- Included: All tools, brass or copper metal (sterling silver available at extra cost), expert instruction
- Who it's for: Complete beginners
- Techniques: Sawing, shaping, filing, texturing, finishing, polishing
- Upcoming dates: 5 Jul–8 Jul 2026 (sold out), 23 Aug–26 Aug 2026 (sold out), new dates TBC

### 2. Design a Jewelry Set
- Price: LE 4,800
- Duration: 6 days (e.g. 5 Jul–13 Jul 2026)
- What you create: A fully sketched, measured jewelry set (necklace, earrings, ring)
- Included: All drawing supplies and professional instruction
- Who it's for: Beginners to those exploring jewelry design professionally
- Status: Currently sold out

### 3. Make a Ring Workshop
- Price: LE 3,400
- Duration: 4 evenings, 6:00 PM – 9:00 PM each
- What you make: A ring in the metal of your choice, sized to your finger, made completely by hand
- Included: All tools, brass or copper (you choose), professional guidance. Sterling silver available to purchase by weight on the day.
- Who it's for: Complete beginners, anyone making a ring for someone they love
- Techniques: Measuring, cutting, shaping, soldering, filing, polishing
- Upcoming dates: 28 Jun–1 Jul 2026 (1 seat remaining), 2 Aug–5 Aug 2026

### 4. The Earrings Workshop
- Price: Not available online — ask Rouby for details
- NOTE: If customer asks, say you don't have full details yet and offer to connect them with Rouby directly

### 5. One Day Ring Workshop
- Price: LE 900
- Duration: 4 hours (single day)
- What you make: Your own open ring — no soldering, no torch
- Included: All tools and materials; brass or copper
- Max class size: 8 students
- Upcoming dates (Saturdays):
  - 20 Jun 2026, 11am–3pm (sold out)
  - 20 Jun 2026, 4pm–7pm (sold out)
  - 27 Jun 2026, 11am–3pm (6 seats remaining)
  - 27 Jun 2026, 4pm–7pm (6 seats remaining)

### 6. Host Your Own Event
- Price: LE 9,500
- Type: Private group / bridal party / corporate event
- Details: Host a private jewelry-making session for your group at Beit Barsoum

### 7. Gouache Rendering for Jewelry
- Price: LE 3,900
- Duration: 4 days (evenings)
- What you create: A portfolio of original jewelry illustrations rendered in gouache
- Included: All paints and paper, all rendering tools, professional guidance
- Who it's for: Complete beginners, jewelry lovers who want to draw their ideas
- Upcoming dates: 19 Jul–22 Jul 2026 (8 seats remaining), 16 Aug–19 Aug 2026

## Jewelry Collections
- Keys of Trust Collection: Handcrafted pieces, LE 2,500–11,500
- The Names We Carry Collection: Name pendants, cartouche pendants, letter necklaces
- Other: Promise necklaces, keeper jewelry sets

## Location & Contact
- Address: Beit Barsoum, Fustat, Cairo
- Website: https://beitbarsoum.com
- Google Maps: https://maps.app.goo.gl/Tr2gypD66BDU2Q2W8
- Social: @beitbarsoum (Facebook, Instagram, YouTube, Pinterest)

## Booking & Payment
- Workshops bookable via beitbarsoum.com
- Payment on website (EGP)
- Sterling silver is NOT included in the base price — available to purchase by weight on the day

## FAQs
- Can I bring a friend? Yes, they can book separately
- What level do I need? All workshops are suitable for complete beginners
- Minimum age? (Ask Rouby — not confirmed)
- Installment payments? (Ask Rouby — not confirmed)
- International shipping? (Ask Rouby — not confirmed)
- Refund/cancellation policy? (Ask Rouby — not confirmed)
`;

// ── Main handler ──────────────────────────────────────────────

function doPost(e) {
  try {
    const body = JSON.parse(e.parameter.data);
    const { message, sessionId, history, scenario } = body;

    const isFeedback = message.trim().toUpperCase().startsWith('FEEDBACK:');
    const reply = callGemini(message, history);

    if (isFeedback) {
      logToSheet(sessionId, scenario, history, message, reply);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ reply, logged: isFeedback }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Beit Barsoum bot backend is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Gemini call ───────────────────────────────────────────────

function callGemini(userMessage, history) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const contents = (history || []).map(msg => ({
    role: msg.role === 'bot' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));
  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  const payload = {
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT + '\n\n---\n\n' + KNOWLEDGE_BASE }]
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 600
    }
  };

  const response = UrlFetchApp.fetch(url, {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const result = JSON.parse(response.getContentText());
  if (result.error) throw new Error(result.error.message);
  return result.candidates[0].content.parts[0].text;
}

// ── Sheets logging ────────────────────────────────────────────

function logToSheet(sessionId, scenario, history, feedbackMessage, botReply) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName('Feedback');

  if (!sheet) {
    sheet = ss.insertSheet('Feedback');
    sheet.appendRow(['Timestamp', 'Session ID', 'Scenario', 'Full Conversation', 'Rouby Feedback', 'Bot Reply to Feedback']);
    sheet.setFrozenRows(1);
    sheet.getRange('1:1').setFontWeight('bold');
  }

  const conversation = (history || [])
    .map(m => `[${m.role === 'bot' ? 'BOT' : 'ROUBY'}] ${m.text}`)
    .join('\n');

  sheet.appendRow([
    new Date().toISOString(),
    sessionId,
    scenario || '(none selected)',
    conversation,
    feedbackMessage,
    botReply
  ]);
}
