/**
 * Converts a UTC ISO date string to the user's local timezone
 * Uses Intl API — works in all modern browsers
 */
export function toLocalTime(isoUTC: string): string {
  const date = new Date(isoUTC);
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function toLocalDate(isoUTC: string): string {
  const date = new Date(isoUTC);
  return date.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function toLocalDateTime(isoUTC: string): string {
  return `${toLocalDate(isoUTC)} · ${toLocalTime(isoUTC)}`;
}

export function getTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function isToday(isoUTC: string): boolean {
  const date = new Date(isoUTC);
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}
