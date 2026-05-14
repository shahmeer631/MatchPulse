import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Validate env at module level — fail fast with clear error
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("⚠️  STRIPE_SECRET_KEY not set — Stripe features disabled");
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : null;

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      {
        error:    "Stripe not configured",
        message:  "Add STRIPE_SECRET_KEY to .env.local",
        docsUrl:  "https://dashboard.stripe.com/apikeys",
      },
      { status: 503 }
    );
  }

  if (!process.env.STRIPE_PRICE_ID) {
    return NextResponse.json(
      {
        error:   "STRIPE_PRICE_ID not set",
        message:
          "Add STRIPE_PRICE_ID to .env.local: a Price ID (price_…) or Product ID (prod_…). See README.",
        docsUrl: "https://dashboard.stripe.com/products",
      },
      { status: 503 }
    );
  }

  let body: { priceId?: string; email?: string } = {};
  try {
    body = await req.json();
  } catch {
    // body is optional
  }

  const priceOrProductId = body.priceId || process.env.STRIPE_PRICE_ID;
  const appUrl           = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const unitAmountRaw = parseInt(process.env.STRIPE_SUBSCRIPTION_UNIT_AMOUNT || "999", 10);
  const unitAmount    = Number.isFinite(unitAmountRaw) && unitAmountRaw > 0 ? unitAmountRaw : 999;
  const currency = (process.env.STRIPE_SUBSCRIPTION_CURRENCY || "eur").toLowerCase();

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = priceOrProductId.startsWith("prod_")
    ? [
        {
          quantity: 1,
          price_data: {
            currency,
            product:     priceOrProductId,
            unit_amount: unitAmount,
            recurring:   { interval: "month" },
          },
        },
      ]
    : [{ price: priceOrProductId, quantity: 1 }];

  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items,
      mode: "subscription",
      success_url: `${appUrl}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${appUrl}/premium?canceled=true`,
      locale:      "es",
      allow_promotion_codes:    true,
      billing_address_collection: "required",
      subscription_data: {
        metadata: {
          platform: "matchpulse",
          createdAt: new Date().toISOString(),
        },
        trial_period_days: 7, // 7-day free trial — remove if not wanted
      },
      // Pre-fill email if provided
      ...(body.email ? { customer_email: body.email } : {}),
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      sessionId: session.id,
      url:       session.url,
    });
  } catch (err: unknown) {
    const stripeErr = err as Stripe.StripeRawError;
    console.error("Stripe checkout error:", stripeErr.message);
    return NextResponse.json(
      { error: stripeErr.message || "Stripe error" },
      { status: 400 }
    );
  }
}
