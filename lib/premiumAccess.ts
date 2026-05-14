const PREMIUM_ACCESS_KEY = "matchpulse_premium_access";

export const PREMIUM_ACCESS_CHANGED = "matchpulse-premium-access-changed";

export type PremiumAccessPayload = {
  stripe?: boolean;
  /** Shared / demo password unlock */
  password?: boolean;
};

function dispatchChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PREMIUM_ACCESS_CHANGED));
}

function read(): PremiumAccessPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PREMIUM_ACCESS_KEY);
    if (!raw) return null;
    if (raw === "true") return { stripe: true };
    const j = JSON.parse(raw) as PremiumAccessPayload;
    return j && typeof j === "object" ? j : null;
  } catch {
    return null;
  }
}

export function getPremiumAccessPayload(): PremiumAccessPayload | null {
  return read();
}

export function hasPremiumAccess(): boolean {
  const p = read();
  return !!(p?.stripe || p?.password);
}

/** After server verifies Stripe Checkout `session_id` */
export function setStripePremiumVerified(): void {
  if (typeof window === "undefined") return;
  const p = read() || {};
  p.stripe = true;
  localStorage.setItem(PREMIUM_ACCESS_KEY, JSON.stringify(p));
  dispatchChanged();
}

export function setPasswordPremiumVerified(): void {
  if (typeof window === "undefined") return;
  const p = read() || {};
  p.password = true;
  localStorage.setItem(PREMIUM_ACCESS_KEY, JSON.stringify(p));
  dispatchChanged();
}

/** Logout for password-only unlock; keeps Stripe subscription flag if present */
export function clearPasswordPremiumAccess(): void {
  if (typeof window === "undefined") return;
  const p = read();
  if (!p) return;
  delete p.password;
  if (p.stripe) {
    localStorage.setItem(PREMIUM_ACCESS_KEY, JSON.stringify(p));
  } else {
    localStorage.removeItem(PREMIUM_ACCESS_KEY);
  }
  dispatchChanged();
}
