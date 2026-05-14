import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : null;

// Needed to read raw body for signature verification
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body      = await req.text();
  const signature = req.headers.get("stripe-signature");
  const secret    = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    console.error("Webhook: missing signature or secret");
    return NextResponse.json({ error: "Missing webhook config" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Signature verification failed";
    console.error("Webhook signature error:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  console.log(`✅ Stripe webhook: ${event.type}`);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // ── Production: save subscription to your database here ──
      // Example with a DB: await db.subscriptions.upsert({ customerId: session.customer, status: "active" })
      console.log("New subscription:", {
        customerId:     session.customer,
        email:          session.customer_details?.email,
        subscriptionId: session.subscription,
        amount:         session.amount_total,
      });
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      console.log("Subscription updated:", { id: sub.id, status: sub.status });
      // Update DB status
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      console.log("Subscription cancelled:", { id: sub.id, customer: sub.customer });
      // Revoke access in DB
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log("Payment failed:", { customer: invoice.customer, amount: invoice.amount_due });
      // Send dunning email, pause access
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log("Payment succeeded:", { customer: invoice.customer });
      // Renew access, send receipt
      break;
    }

    default:
      // Unhandled event type — fine to ignore
      break;
  }

  return NextResponse.json({ received: true });
}
