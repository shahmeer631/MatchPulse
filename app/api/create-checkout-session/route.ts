import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-06-20",
});

async function resolveStripePriceId(inputId?: string) {
  const rawId = (inputId || process.env.STRIPE_PRICE_ID || "").trim();
  if (!rawId) {
    throw new Error("Falta STRIPE_PRICE_ID en configuración.");
  }

  // Accept either a Price ID (price_...) or Product ID (prod_...).
  if (rawId.startsWith("price_")) return rawId;

  if (rawId.startsWith("prod_")) {
    const product = await stripe.products.retrieve(rawId, { expand: ["default_price"] });
    const defaultPrice = product.default_price;

    if (!defaultPrice) {
      throw new Error("El producto no tiene precio por defecto en Stripe.");
    }

    if (typeof defaultPrice === "string") return defaultPrice;
    if (defaultPrice.id) return defaultPrice.id;
  }

  throw new Error("ID de Stripe inválido. Usa price_xxx o prod_xxx.");
}

export async function POST(req: NextRequest) {
  // Guard: return helpful error if keys not configured
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("REPLACE")) {
    return NextResponse.json(
      { error: "Stripe no configurado. Añade tus claves en .env.local" },
      { status: 503 }
    );
  }

  try {
    const { priceId } = await req.json();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resolvedPriceId = await resolveStripePriceId(priceId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: resolvedPriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${appUrl}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/premium?canceled=true`,
      locale: "es",
      allow_promotion_codes: true,
      billing_address_collection: "required",
      subscription_data: {
        metadata: { platform: "matchpulse" },
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("Stripe error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
