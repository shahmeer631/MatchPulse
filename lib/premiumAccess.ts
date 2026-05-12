const PREMIUM_ACCESS_KEY = "matchpulse_premium_access";

export function hasPremiumAccess(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(PREMIUM_ACCESS_KEY) === "true";
}

export function setPremiumAccess(enabled: boolean): void {
  if (typeof window === "undefined") return;
  if (enabled) {
    window.localStorage.setItem(PREMIUM_ACCESS_KEY, "true");
    return;
  }
  window.localStorage.removeItem(PREMIUM_ACCESS_KEY);
}
