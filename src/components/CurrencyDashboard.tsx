"use client";

import type { ReactNode } from "react";
import { useEffect, useCallback, useRef, useState } from "react";
import type { HackWalletUser } from "../lib/hackclub-auth";
import RotatingInfoCard from "./RotatingInfoCard";

type SettingsPhase = "closed" | "opening" | "open" | "closing";

export default function CurrencyDashboard({
  currentUser,
}: {
  currentUser: HackWalletUser | null;
}) {
  const [isRedTheme, setIsRedTheme] = useState(false);
  const [settingsPhase, setSettingsPhase] = useState<SettingsPhase>("closed");
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const toggleTheme = useCallback(() => setIsRedTheme((v) => !v), []);

  useEffect(() => {
    if (settingsPhase === "closed") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [settingsPhase]);

  useEffect(() => {
    if (settingsPhase !== "opening") return;

    const animationFrame = window.requestAnimationFrame(() => {
      setSettingsPhase("open");
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [settingsPhase]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const openSettings = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setSettingsPhase("opening");
  }, []);

  const closeSettings = useCallback(() => {
    if (settingsPhase === "closed" || settingsPhase === "closing") return;

    setSettingsPhase("closing");
    closeTimerRef.current = window.setTimeout(() => {
      setSettingsPhase("closed");
      closeTimerRef.current = null;
    }, 240);
  }, [settingsPhase]);

  return (
    <>
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
              onClick={openSettings}
            >
              <span aria-hidden>Settings</span>
            </button>

            <div className="flex items-center gap-2">
              <div
                className="grid h-8 w-8 place-items-center rounded-full bg-violet-300 text-sm font-semibold text-black"
                aria-hidden
              >
                {getInitial(currentUser?.displayName)}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-medium">
                  {currentUser ? `${currentUser.displayName}'s wallet` : "HackWallet"}
                </p>
                <p className="text-xs text-white/60">
                  {currentUser ? currentUser.email ?? "Signed in with Hack Club" : "Sign in to sync"}
                </p>
              </div>
              <span className="text-white/50" aria-hidden>
                ⌄
              </span>
            </div>

            <div className="relative flex items-center gap-2">
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
                onClick={() => setIsMoreOpen((value) => !value)}
              >
                <span aria-hidden>More</span>
              </button>

              {!currentUser ? (
                <a
                  href="/api/auth/login"
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60"
                >
                  Sign in
                </a>
              ) : null}

              {isMoreOpen ? (
                <div className="absolute right-0 top-full z-40 mt-3 w-52 rounded-2xl border border-white/10 bg-[#131418] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                  <a
                    href="https://github.com/RichardD242/HackWallet"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3 text-left transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60"
                  >
                    <GitHubMark />
                    <div>
                      <p className="text-sm font-medium text-white">GitHub</p>
                      <p className="text-xs text-white/50">source code</p>
                    </div>
                  </a>
                </div>
              ) : null}
            </div>
          </header>

          <main className="space-y-6 text-left">
            <p className="text-sm text-white/55">
              {currentUser ? `${currentUser.displayName}'s wallet` : "Sign in with Hack Club to sync your wallet"}
            </p>

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
              <p className="mt-3 text-sm text-white/60">
                {currentUser ? "No assets yet" : "Sign in to see your wallet"}
              </p>
              <p className="mt-1 text-xs text-white/50">
                {currentUser ? "Buy or create assets to get started" : "Hack Club Auth syncs your account"}
              </p>
              {!currentUser ? (
                <a
                  href="/api/auth/login"
                  className="mt-4 inline-flex rounded-full bg-violet-300 px-4 py-2 text-sm font-semibold text-black transition hover:bg-violet-200"
                >
                  Sign in with Hack Club
                </a>
              ) : null}
            </section>
          </main>
        </div>
      </div>

      {settingsPhase !== "closed" ? (
        <div
          className={
            settingsPhase === "closing"
              ? "fixed inset-0 z-50 flex items-center justify-center bg-black/0 px-3 py-4 backdrop-blur-none transition-[background-color,backdrop-filter] duration-200 ease-out sm:px-6 lg:px-10"
              : "settings-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-3 py-4 backdrop-blur-md sm:px-6 lg:px-10"
          }
          role="presentation"
          onClick={closeSettings}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            className={
              settingsPhase === "closing"
                ? "flex h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#101114] text-white opacity-0 shadow-[0_30px_120px_rgba(0,0,0,0.65)] scale-[0.985] translate-y-3 transition-[opacity,transform] duration-200 ease-out sm:h-[calc(100vh-3rem)]"
                : "settings-panel flex h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#101114] text-white shadow-[0_30px_120px_rgba(0,0,0,0.65)] sm:h-[calc(100vh-3rem)]"
            }
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-5 lg:px-8">
              <button
                type="button"
                aria-label="Close settings"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-lg text-white/85 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60"
                onClick={closeSettings}
              >
                <span aria-hidden>×</span>
              </button>

              <h2 id="settings-title" className="text-base font-medium tracking-tight text-white">
                Settings
              </h2>

              <span className="h-10 w-10" aria-hidden />
            </div>

            <div className="grid flex-1 gap-6 overflow-hidden px-6 py-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:px-8 lg:py-8">
              <section className="flex h-full flex-col justify-between gap-6 rounded-4xl border border-white/10 bg-[#17181d] p-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                      User
                    </h3>
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-white/60">
                      {currentUser ? "synced" : "signed out"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-[1.75rem] border border-white/10 bg-[#121318] px-5 py-5 text-left transition hover:border-white/15 hover:bg-[#1a1c22]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="grid h-14 w-14 place-items-center rounded-full bg-violet-300 text-base font-semibold text-black">
                        {getInitial(currentUser?.displayName)}
                      </div>
                      <div>
                        <p className="text-base font-medium text-white">
                          {currentUser?.displayName ?? "Guest"}
                        </p>
                        <p className="mt-1 text-sm text-white/55">
                          {currentUser ? currentUser.email ?? "synced" : "sign in to sync"}
                        </p>
                      </div>
                    </div>

                    <ChevronIcon />
                  </button>

                  <div className="grid gap-4 text-white/70 sm:grid-cols-2">
                    <SummaryTile label="Accounts" value="1" />
                    <SummaryTile label="Currencies" value="2" />
                    <SummaryTile label="Joined" value="Today" />
                    <SummaryTile label="Security" value="dev" />
                  </div>
                </div>

                {currentUser ? (
                  <a
                    href="/api/auth/logout"
                    className="flex w-full items-center justify-center rounded-[1.25rem] bg-[#d1d5db] px-4 py-4 text-sm font-semibold text-[#111827] transition hover:bg-[#e5e7eb]"
                  >
                    Sign out
                  </a>
                ) : (
                  <a
                    href="/api/auth/login"
                    className="flex w-full items-center justify-center rounded-[1.25rem] bg-[#d1d5db] px-4 py-4 text-sm font-semibold text-[#111827] transition hover:bg-[#e5e7eb]"
                  >
                    Sign in with Hack Club
                  </a>
                )}
              </section>

              <section className="grid h-full gap-4 overflow-hidden rounded-4xl border border-white/10 bg-[#17181d] p-5 lg:grid-rows-[auto_1fr]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                    Settings
                  </h3>
                </div>

                <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-[auto_auto]">
                  <SettingsSection
                    title="Accounts"
                    items={[{ label: "Signed in with Hackclub0Auth" }]}
                  />

                  <SettingsSection
                    title="Preferences"
                    items={[
                      { label: "Appearance" },
                      { label: "Dark" },
                      { label: "White" },
                    ]}
                  />

                  <SettingsSection
                    title="Support"
                    items={[
                      {
                        label: "About",
                        detail: "Currency system for hackclub users for macondo",
                      },
                    ]}
                  />
                </div>
              </section>
            </div>
          </section>
        </div>
      ) : null}
    </>
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

function SettingsSection({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; count?: string; detail?: string }>;
}) {
  return (
    <section className="flex h-full flex-col gap-3 rounded-3xl border border-white/10 bg-[#17181d] p-4">
      <h3 className="px-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
        {title}
      </h3>

      <div className="overflow-hidden rounded-[1.25rem] border border-white/5 bg-[#121318]">
        {items.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className={
              index === items.length - 1
                ? "flex w-full items-center justify-between px-4 py-4 text-left transition hover:bg-white/5"
                : "flex w-full items-center justify-between border-b border-white/5 px-4 py-4 text-left transition hover:bg-white/5"
            }
          >
            <div className="flex items-center gap-3">
              <SettingGlyph />
              <div className="min-w-0">
                <span className="block text-sm text-white/85">{item.label}</span>
                {item.detail ? (
                  <span className="mt-1 block text-xs leading-5 text-white/50">{item.detail}</span>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {item.count ? (
                <span className="rounded-full bg-white/8 px-2.5 py-1 text-xs font-medium text-white/70">
                  {item.count}
                </span>
              ) : null}
              <ChevronIcon />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className="mt-2 text-lg font-medium text-white">{value}</p>
    </div>
  );
}

function getInitial(displayName?: string) {
  if (!displayName) return "H";

  const trimmed = displayName.trim();

  return trimmed ? trimmed.charAt(0).toUpperCase() : "H";
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className="h-5 w-5 text-white/35"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 4 5 6-5 6" />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-8 w-8 shrink-0 text-white"
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.48v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.92-.65.07-.64.07-.64 1.02.07 1.56 1.08 1.56 1.08.9 1.58 2.37 1.12 2.95.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.38-2.03 1-2.75-.1-.26-.43-1.3.1-2.7 0 0 .83-.27 2.72 1.05a9.17 9.17 0 0 1 4.95 0c1.9-1.32 2.72-1.05 2.72-1.05.53 1.4.2 2.44.1 2.7.62.72 1 1.63 1 2.75 0 3.95-2.34 4.82-4.57 5.08.36.32.68.95.68 1.92v2.84c0 .26.18.59.69.48A10.27 10.27 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function SettingGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-5 w-5 shrink-0 text-violet-300"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.75c1 0 1.38.62 1.8 1.32l.2.33c.28.46.7.81 1.2 1l.37.14c.8.3 1.4.47 1.96.9.56.43.87 1.06 1.1 1.83l.11.35c.16.52.5.95.97 1.24l.3.18c.62.37 1.2.73 1.53 1.35.33.62.33 1.35 0 1.97-.33.62-.91.98-1.53 1.35l-.3.18c-.47.29-.81.72-.97 1.24l-.11.35c-.23.77-.54 1.4-1.1 1.83-.56.43-1.16.6-1.96.9l-.37.14c-.5.19-.92.54-1.2 1l-.2.33c-.42.7-.8 1.32-1.8 1.32s-1.38-.62-1.8-1.32l-.2-.33c-.28-.46-.7-.81-1.2-1l-.37-.14c-.8-.3-1.4-.47-1.96-.9-.56-.43-.87-1.06-1.1-1.83l-.11-.35c-.16-.52-.5-.95-.97-1.24l-.3-.18c-.62-.37-1.2-.73-1.53-1.35-.33-.62-.33-1.35 0-1.97.33-.62.91-.98 1.53-1.35l.3-.18c.47-.29.81-.72.97-1.24l.11-.35c.23-.77.54-1.4 1.1-1.83.56-.43 1.16-.6 1.96-.9l.37-.14c.5-.19.92-.54 1.2-1l.2-.33c.42-.7.8-1.32 1.8-1.32Z" />
      <circle cx="12" cy="12" r="2.75" />
    </svg>
  );
}
