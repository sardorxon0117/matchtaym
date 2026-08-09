"use client";

import { useEffect, useState } from "react";

/** Cycles 0..count-1 every `intervalMs`; stays at 0 and never ticks if count <= 1. */
export function useRotatingIndex(count: number, intervalMs: number): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, intervalMs);
    return () => clearInterval(id);
  }, [count, intervalMs]);

  // Keep the index in range if the list shrinks.
  return count > 0 ? index % count : 0;
}
