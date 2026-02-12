import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenText,
  CalendarCheck2,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import styles from "./landing.module.css";

const proofStats = [
  { label: "Core Workspace", value: "Trade Journal" },
  { label: "Insight Layer", value: "Performance Reports" },
  { label: "Focused Tracking", value: "Prop Firm Manager" },
];

const featureCards = [
  {
    icon: BarChart3,
    title: "Performance Breakdown That Finds Patterns",
    description:
      "Track win rate, expectancy, drawdown behavior, and execution quality with clear weekly reporting.",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    icon: BookOpenText,
    title: "Trade Journal + Notes",
    description:
      "Attach context to every trade with comments, screenshots, and post-session lessons.",
    className: "md:col-span-1",
  },
  {
    icon: ShieldCheck,
    title: "Prop Firm Account Tracking",
    description:
      "Monitor funded-account progress and transactions in one dedicated workspace.",
    className: "md:col-span-1",
  },
  {
    icon: CalendarCheck2,
    title: "Daily Review Workflow",
    description:
      "Close each session with a repeatable process so improvements compound instead of resetting.",
    className: "md:col-span-1",
  },
  {
    icon: Sparkles,
    title: "Private by Design",
    description:
      "Read-only trade connections, encrypted storage, and secure auth keep your account and data under your control.",
    className: "md:col-span-2",
  },
];

const habitLoops = [
  {
    step: "01",
    title: "Capture",
    description: "Your trades, screenshots, and notes are logged instantly with no manual spreadsheet work.",
  },
  {
    step: "02",
    title: "Diagnose",
    description: "Find the exact setup, time window, and behavior patterns behind your best and worst weeks.",
  },
  {
    step: "03",
    title: "Refine",
    description: "Turn insights into rules, track adherence, and compound consistency with a repeatable process.",
  },
];

const testimonials = [
  {
    quote:
      "I stopped guessing which setup was actually paying me. The review flow made my execution noticeably cleaner in two weeks.",
    name: "M. Rivera",
    role: "Futures Trader",
  },
  {
    quote:
      "The multi-account view solved my prop firm chaos. I finally see my true risk across accounts before I overtrade.",
    name: "A. Foster",
    role: "Prop Firm Trader",
  },
  {
    quote:
      "The psychology notes tied to performance are the difference. I can literally see when discipline slips and fix it fast.",
    name: "J. Patel",
    role: "Index Scalper",
  },
];

export default function LandingPage() {
  return (
    <main className={styles.page}>
      <div className={styles.mesh} aria-hidden />
      <div className={styles.noise} aria-hidden />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090b10]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/favicon.png"
              width={34}
              height={34}
              alt="TraderRecord"
              className="rounded-lg"
            />
            <span className={`text-lg tracking-wide ${styles.display}`}>
              TraderRecord
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            <Button
              asChild
              className="h-10 rounded-full bg-[#5ef2b7] px-5 text-sm font-semibold text-[#06100d] shadow-[0_0_0_1px_rgba(255,255,255,0.12)] transition hover:bg-[#74ffc5]"
            >
              <Link href="/sign-in">Start Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pb-20 pt-14 md:px-6 md:pb-24 md:pt-20">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
              <Sparkles className="h-4 w-4" />
              Precision Journaling for Serious Traders
            </p>

            <h1
              className={`text-5xl leading-[0.9] text-white sm:text-6xl md:text-7xl lg:text-8xl ${styles.display}`}
            >
              Trade Less Noise.
              <br />
              Compound More Edge.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
              TraderRecord transforms raw executions into actionable decisions.
              Capture your trades, surface the patterns that actually pay, and
              build a review routine that sharpens performance week after week.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                className="h-12 rounded-full bg-[#5ef2b7] px-7 text-base font-semibold text-[#06100d] transition hover:bg-[#74ffc5]"
              >
                <Link href="/sign-in" className="inline-flex items-center gap-2">
                  Start Journaling Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {proofStats.map((item) => (
                <article
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                >
                  <p className={`${styles.mono} text-xl text-emerald-200`}>
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-zinc-400">
                    {item.label}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.shellWrap}>
            <div className={styles.shellGlow} aria-hidden />
            <div className={styles.shell}>
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/90" />
                </div>
                <p className={`${styles.mono} text-xs text-zinc-400`}>
                  Session Overview
                </p>
              </div>

              <div className="space-y-4 p-5">
                <div className="grid grid-cols-3 gap-3">
                  <article className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-400">
                      Win Rate
                    </p>
                    <p className={`${styles.mono} mt-1 text-lg text-emerald-200`}>
                      68.4%
                    </p>
                  </article>
                  <article className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-400">
                      Expectancy
                    </p>
                    <p className={`${styles.mono} mt-1 text-lg text-cyan-200`}>
                      +0.42R
                    </p>
                  </article>
                  <article className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-400">
                      Rule Score
                    </p>
                    <p className={`${styles.mono} mt-1 text-lg text-amber-200`}>
                      91/100
                    </p>
                  </article>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#080c12] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">
                      Equity Curve
                    </p>
                    <p className={`${styles.mono} text-xs text-emerald-300`}>
                      +12.7% this month
                    </p>
                  </div>

                  <svg viewBox="0 0 420 170" className="h-[170px] w-full">
                    <defs>
                      <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6bf4c0" />
                        <stop offset="100%" stopColor="#8dc5ff" />
                      </linearGradient>
                      <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6bf4c0" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#6bf4c0" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    <path
                      d="M0 140 C40 120 55 122 90 98 C130 68 150 78 190 66 C230 53 250 42 290 38 C330 34 355 10 420 18 L420 170 L0 170 Z"
                      fill="url(#fill)"
                    />
                    <path
                      d="M0 140 C40 120 55 122 90 98 C130 68 150 78 190 66 C230 53 250 42 290 38 C330 34 355 10 420 18"
                      fill="none"
                      stroke="url(#line)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className={styles.curve}
                    />
                  </svg>

                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {[36, 44, 58, 63, 79].map((height, index) => (
                      <div
                        key={height}
                        className={styles.volumeBar}
                        style={{
                          height: `${height}%`,
                          animationDelay: `${index * 110}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <p className="rounded-xl border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-xs text-emerald-100">
                  Rule break alert: most losses came after 10:45 AM. Consider
                  hard stop after 3 consecutive losing trades.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 md:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-12 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Platform Highlights
              </p>
              <h2
                className={`mt-3 text-4xl leading-[0.95] text-white sm:text-5xl md:text-6xl ${styles.display}`}
              >
                Built for Traders Who Review Like Professionals
              </h2>
            </div>
            <p className="max-w-md text-zinc-300">
              Inspired by modern journaling products, redesigned with a sharper
              structure: less marketing noise, more outcome-focused clarity.
            </p>
          </div>

          <div className="grid auto-rows-[minmax(180px,auto)] gap-4 md:grid-cols-3">
            {featureCards.map(({ icon: Icon, title, description, className }) => (
              <article
                key={title}
                className={`group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-300/35 hover:bg-white/[0.05] ${className}`}
              >
                <div className="mb-4 inline-flex rounded-xl border border-emerald-300/30 bg-emerald-300/10 p-3 text-emerald-200">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-white md:text-2xl">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 md:px-6">
        <div className="mx-auto grid w-full max-w-6xl gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-[1.05fr_0.95fr] md:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Trading Improvement Loop
            </p>
            <h2
              className={`mt-3 text-4xl leading-[0.95] text-white sm:text-5xl ${styles.display}`}
            >
              A Weekly Routine You Can Actually Stick To
            </h2>
            <p className="mt-5 max-w-xl text-zinc-300">
              Most landing pages sell features. TraderRecord is designed to
              build behavior. Every section of the product points back to one
              goal: repeatable, data-backed execution.
            </p>
            <div className="mt-8 space-y-4">
              {habitLoops.map((loop) => (
                <article
                  key={loop.step}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <p className={`${styles.mono} text-sm text-cyan-200`}>
                    Step {loop.step}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white">
                    {loop.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-300">{loop.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {testimonials.map((entry) => (
              <article
                key={entry.name}
                className="rounded-2xl border border-white/10 bg-[#0a0f15] p-5"
              >
                <div className="mb-3 flex text-amber-300">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-zinc-200">
                  {entry.quote}
                </p>
                <p className="mt-4 text-sm font-semibold text-white">
                  {entry.name}
                </p>
                <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">
                  {entry.role}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 md:px-6">
        <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-emerald-200/20 bg-gradient-to-r from-emerald-300/20 via-cyan-300/15 to-blue-300/20 p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/90">
            Ready to level up your execution?
          </p>
          <h2
            className={`mt-3 text-4xl leading-[0.95] text-white sm:text-5xl md:text-6xl ${styles.display}`}
          >
            Replace Guesswork With Measurable Progress
          </h2>
          <p className="mt-5 max-w-2xl text-zinc-100/90">
            Start your journal and get your first improvement report in
            minutes.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 rounded-full bg-[#5ef2b7] px-7 text-base font-semibold text-[#06100d] transition hover:bg-[#74ffc5]"
            >
              <Link href="/sign-in" className="inline-flex items-center gap-2">
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-8 md:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 text-zinc-400 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/favicon.png"
              width={22}
              height={22}
              alt="TraderRecord"
              className="rounded"
            />
            <span className={`text-base text-zinc-200 ${styles.display}`}>
              TraderRecord
            </span>
          </div>
          <p className="text-xs uppercase tracking-[0.12em]">
            © {new Date().getFullYear()} TraderRecord. Built for disciplined
            trading.
          </p>
        </div>
      </footer>
    </main>
  );
}
