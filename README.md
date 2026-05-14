# MatchPulse — Production Setup Guide

## Quick Start
```bash
npm install
cp .env.example .env.local   # fill in your real keys
npm run dev
```

---

## Required Environment Variables

### 1. Football Data API (Real Match Data)
Register FREE at https://www.football-data.org/register
```
FOOTBALL_API_KEY=your_key_here
```
- Free tier: 10 calls/min, all 4 leagues included
- Paid tier: real-time, no limits — https://www.football-data.org/pricing

### 2. Anthropic API (Real AI Analysis)
Get key at https://console.anthropic.com/
```
ANTHROPIC_API_KEY=sk-ant-your_key_here
```
- AI analysis generated per match on-demand when user clicks "Ver análisis IA"
- Uses Claude claude-opus-4-5 model

### 3. Stripe (Real Payments)
Dashboard: https://dashboard.stripe.com

**Step 1 — API Keys** (https://dashboard.stripe.com/apikeys):
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

**Step 2 — Create Product** (https://dashboard.stripe.com/products):
- Name: MatchPulse Premium
- Price: 9.99 EUR / month recurring

Set `STRIPE_PRICE_ID` to either:
- **Price ID** (starts with `price_`) — Checkout uses that price as-is (recommended for production).
- **Product ID** (starts with `prod_`) — Checkout uses inline `price_data` for a **monthly** subscription. Defaults match 9.99 EUR unless you override:

```
STRIPE_PRICE_ID=prod_...
# Only used when STRIPE_PRICE_ID is a product id (minor units, e.g. 999 = €9.99)
STRIPE_SUBSCRIPTION_UNIT_AMOUNT=999
STRIPE_SUBSCRIPTION_CURRENCY=eur
```

**Step 3 — Webhook** (https://dashboard.stripe.com/webhooks):
- Add endpoint: `https://yourdomain.com/api/webhook`
- Events to listen: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`, `invoice.payment_succeeded`
- Copy webhook signing secret:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. App URL
```
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add env vars in Vercel dashboard or via CLI:
vercel env add FOOTBALL_API_KEY
vercel env add ANTHROPIC_API_KEY
vercel env add STRIPE_SECRET_KEY
# ... etc
```

Or: push to GitHub → import in vercel.com → add env vars in dashboard.

---

## Testing Stripe Locally

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
brew install stripe/stripe-cli/stripe

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhook

# Trigger test events
stripe trigger checkout.session.completed
```

---

## Project Structure

```
app/
├── api/
│   ├── matches/route.ts          ← Real football-data.org API
│   ├── ai-analysis/route.ts      ← Real Claude AI analysis
│   ├── create-checkout-session/  ← Real Stripe checkout
│   └── webhook/route.ts          ← Real Stripe webhooks
├── matches/page.tsx              ← Live matches + AI on-demand
├── premium/page.tsx              ← Stripe + password fallback
├── privacidad/page.tsx           ← GDPR Privacy Policy
└── terminos/page.tsx             ← Terms of Service
components/
├── MatchCard (inside matches/page.tsx)
├── StripeCheckout.tsx
├── EmailCapture.tsx
└── LoadingSpinner.tsx
data/matches.ts                   ← Fallback static data (used as type reference)
lib/dateUtils.ts                  ← Timezone conversion utilities
```

---

## Feature Status

| Feature                  | Status                                    |
|--------------------------|-------------------------------------------|
| Real football API        | ✅ football-data.org (add API key)        |
| Live score updates       | ✅ Auto-refresh every 60s                 |
| AI analysis              | ✅ Claude API (add Anthropic key)         |
| Stripe payments          | ✅ Production-ready (add Stripe keys)     |
| Stripe webhooks          | ✅ Full lifecycle handling                |
| Free vs Premium          | ✅ First match free, rest require Premium |
| Legal pages              | ✅ Privacy Policy + Terms of Service      |
| Mobile responsive        | ✅ Full mobile support                    |
| SEO / OG tags            | ✅ Complete meta tags                     |
| Timezone-aware times     | ✅ Intl API client-side conversion        |

---

## Demo Credentials (while Stripe not yet configured)
Password: `matchpulse2025` (or set `NEXT_PUBLIC_PREMIUM_PASSWORD` in .env.local)
