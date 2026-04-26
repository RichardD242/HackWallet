"use client";

import { useEffect, useMemo, useState } from "react";

export default function RotatingInfoCard({
  items,
  intervalMs = 3500,
}: {
  items: string[];
  intervalMs?: number;
}) {
  const safeItems = useMemo(
    () => (items.length ? items : ["Get real-time updates on your crypto, NFTs, and more"]),
    [items]
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (safeItems.length <= 1) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % safeItems.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [intervalMs, safeItems.length]);

  return (
    <section
      aria-label="Info"
      className="relative rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
    >
      <p className="text-sm text-white/70" aria-live="polite">
        {safeItems[index]}
      </p>

      <div className="mt-4 flex items-center justify-center gap-1" aria-label="Carousel position">
        {safeItems.map((_, i) => (
          <span
            key={i}
            className={
              i === index
                ? "h-1 w-6 rounded-full bg-violet-300"
                : "h-1 w-2 rounded-full bg-white/25"
            }
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
