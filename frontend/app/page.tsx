"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, BarChart3, Target, Zap } from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI Marketing Generator", desc: "Full campaign strategies, ad copy, and captions in seconds." },
  { icon: BarChart3, title: "Live Analytics", desc: "Revenue, sales, and conversion tracking that updates in real time." },
  { icon: Target, title: "AI SEO Assistant", desc: "Meta tags, keywords, and landing page copy tuned for ranking." },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-radial from-accent-500/20 via-transparent to-transparent" />

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-mint-500 shadow-glow">
            <Zap size={18} />
          </div>
          <span className="font-display text-lg font-bold">BrandBoost AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost">Log in</Link>
          <Link href="/signup" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-20 pb-24 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mb-6 rounded-full px-4 py-1.5 text-xs font-medium text-white/70"
        >
          AI Marketing & Sales Optimization Platform
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl font-bold leading-tight sm:text-6xl"
        >
          Market smarter.
          <br />
          <span className="bg-aurora bg-clip-text text-transparent">Sell faster.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-xl text-white/50"
        >
          BrandBoost AI turns product details into campaign strategy, SEO copy, and sales
          insight — powered by real AI, wrapped in a dashboard built for growth teams.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex gap-3"
        >
          <Link href="/signup" className="btn-primary">Start Free →</Link>
          <Link href="/login" className="btn-ghost">Log in</Link>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 pb-28 sm:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500/15 text-accent-300">
              <f.icon size={18} />
            </div>
            <h3 className="mb-2 font-display font-semibold">{f.title}</h3>
            <p className="text-sm text-white/45">{f.desc}</p>
          </motion.div>
        ))}
      </section>
    </main>
  );
}
