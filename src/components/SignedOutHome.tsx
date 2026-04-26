"use client";

import { ArrowRight } from "lucide-react";

export default function SignedOutHome() {
  return (
    <div className="min-h-screen text-white">
      <main className="absolute inset-0 z-20 grid place-items-center px-4 py-10 sm:px-6">
        <section className="w-full max-w-2xl text-center">
          <h1 className="text-6xl font-semibold tracking-tight sm:text-7xl">HackWallet</h1>

          <a
            href="/api/auth/login"
            className="mt-10 inline-flex w-full max-w-lg items-center justify-center gap-3 rounded-3xl border border-white/25 bg-white/90 px-6 py-6 text-2xl font-semibold text-[#090b10] shadow-[0_25px_90px_rgba(81,171,255,0.35)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
          >
            Sign in
            <ArrowRight className="h-6 w-6" />
          </a>
        </section>
      </main>
    </div>
  );
}
