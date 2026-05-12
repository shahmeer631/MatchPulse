import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-06-20",
});

export async function GET(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("REPLACE")) {
    return NextResponse.json({ active: false, reason: "stripe_not_configured" }, { status: 503 });
  }

  const sessionId = req.nextUrl.searchParams.get("session_id")?.trim();
  if (!sessionId) {
    return NextResponse.json({ active: false, reason: "missing_session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    const isSubscriptionMode = session.mode === "subscription";
    const isComplete = session.status === "complete";
    const isPaid = session.payment_status === "paid" || session.payment_status === "no_payment_required";

    const subscription = session.subscription;
    const isSubActive =
      typeof subscription !== "string" &&
      !!subscription &&
      ["active", "trialing"].includes(subscription.status);

    const active = isSubscriptionMode && isComplete && isPaid && isSubActive;
    return NextResponse.json({ active });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("Stripe verify session error:", message);
    return NextResponse.json({ active: false, reason: "verification_failed" }, { status: 500 });
  }
}
