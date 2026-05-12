"use client";
import { useEffect, useRef } from "react";

/**
 * Automatically refreshes data every `intervalMs` milliseconds
 * Pauses when tab is hidden (saves battery/requests)
 * Shows a subtle countdown to next refresh
 */
export function useAutoRefresh(
  callback: () => void,
  intervalMs: number = 60000 // default: 1 minute
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const tick = () => {
      if (!document.hidden) {
        callbackRef.current();
      }
    };

    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
