"use client";

import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import RotatingInfoCard from "./RotatingInfoCard";

export default function CurrencyDashboard() {
  const [isRedTheme, setIsRedTheme] = useState(false);
  const toggleTheme = useCallback(() => setIsRedTheme((v) => !v), []);

  return (
    <div
      key={isRedTheme ? "red" : "green"}
      className={
        isRedTheme
          ? "min-h-screen bg-linear-to-b from-[#3b0b0b] via-[#1a0606] to-black text-white"
          : "min-h-screen bg-linear-to-b from-[#0f2d1f] via-[#07140d] to-black text-white"
      }
    >
      <div className="mx-auto w-full max-w-md px-4 py-6 sm:max-w-2xl sm:px-6 lg:max-w-5xl lg:px-8">
        <header className="mb-6 flex items-center justify-between">
          <button
            type="button"
            aria-label="Open settings"
            className="rounded-lg p-2 text-white/70 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <span aria-hidden>Settings</span>
          </button>

          <div className="flex items-center gap-2">
            <div
              className="grid h-8 w-8 place-items-center rounded-full bg-violet-300 text-sm font-semibold text-black"
              aria-hidden
            >
              U
            </div>
            <div className="leading-tight">
              <p className="text-sm font-medium">user</p>
              <p className="text-xs text-white/60">HackWallet</p>
            </div>
            <span className="text-white/50" aria-hidden>
              ⌄
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Toggle red background"
              className="rounded-lg p-2 text-white/70 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              onClick={toggleTheme}
            >
              <span aria-hidden>-</span>
            </button>

            <button
              type="button"
              aria-label="Open network"
              className="rounded-lg p-2 text-white/70 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <span aria-hidden>More</span>
            </button>
          </div>
        </header>

        <main className="space-y-6 text-left">
          <section aria-labelledby="balance-title" className="space-y-3">
            <h1
              id="balance-title"
              className="text-6xl font-semibold tracking-tight sm:text-7xl lg:text-8xl"
            >
              $0.00
            </h1>

            <div className="flex items-center gap-3">
              <p
                className={
                  isRedTheme
                    ? "text-sm font-medium text-red-300"
                    : "text-sm font-medium text-emerald-300"
                }
              >
                +$0.00
              </p>
              <p
                className={
                  isRedTheme
                    ? "inline-flex items-center rounded-full bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-300"
                    : "inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300"
                }
              >
                +0.00%
              </p>
            </div>
          </section>

          <section aria-label="Quick actions" className="grid grid-cols-3 gap-3">
            <PillButton>Receive</PillButton>
            <PillButton>Create</PillButton>
            <PillButton>Send</PillButton>
          </section>

          <RotatingInfoCard
            items={["Created for macondom!", "Join hackclub!", "Made by richardd242"]}
          />

          <section
            aria-labelledby="assets-title"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-md"
          >
            <h2 id="assets-title" className="text-sm font-semibold text-white/80">
              Assets
            </h2>
            <p className="mt-3 text-sm text-white/60">No assets yet</p>
            <p className="mt-1 text-xs text-white/50">Buy or create assets to get started</p>
          </section>
        </main>
      </div>
    </div>
  );
}

function PillButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex w-full items-center justify-center rounded-full bg-violet-300 px-4 py-4 text-base font-semibold text-black transition-colors hover:bg-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:py-5"
    >
      {children}
    </button>
  );
}
