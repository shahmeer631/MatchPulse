import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Stripe not configured" }, { status: 503 });
  }

  let body: { sessionId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const sessionId = body.sessionId?.trim();
  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "sessionId required" }, { status: 400 });
  }

  const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (session.mode !== "subscription") {
      return NextResponse.json({ ok: false, error: "not_subscription" }, { status: 400 });
    }

    let sub: Stripe.Subscription | null = null;
    if (typeof session.subscription === "string") {
      sub = await stripe.subscriptions.retrieve(session.subscription);
    } else if (session.subscription && typeof session.subscription === "object") {
      sub = session.subscription as Stripe.Subscription;
    }

    if (!sub || !["active", "trialing"].includes(sub.status)) {
      return NextResponse.json({ ok: false, error: "subscription_not_active" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "verify_failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
