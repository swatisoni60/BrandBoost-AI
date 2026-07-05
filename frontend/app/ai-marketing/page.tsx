"use client";

import { useState } from "react";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";

interface MarketingOutput {
  campaignStrategy: string;
  instagramCaption: string;
  facebookAd: string;
  linkedinPost: string;
  googleAdCopy: { headline: string; description: string };
  cta: string;
  hashtags: string[];
  bestPostingTime: string;
}

export default function AIMarketingPage() {
  const [form, setForm] = useState({ product: "", targetAudience: "", budget: "", platform: "Instagram", goal: "" });
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<MarketingOutput | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput(null);
    try {
      const data = await api.post<{ campaign: { output: MarketingOutput } }>("/ai/marketing-generator", form);
      setOutput(data.campaign.output);
      toast.success("Campaign generated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen md:pl-64">
      <Sidebar />
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-10 md:py-10">
        <Navbar title="AI Marketing Generator" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <form onSubmit={handleGenerate} className="glass-card flex flex-col gap-4 lg:col-span-2">
            <div className="mb-1 flex items-center gap-2 text-accent-300">
              <Sparkles size={18} />
              <h3 className="font-display font-semibold text-white">Campaign Inputs</h3>
            </div>

            <div>
              <label className="label-text">Product</label>
              <input required className="input-field" placeholder="e.g. Handmade ceramic mugs"
                value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} />
            </div>
            <div>
              <label className="label-text">Target Audience</label>
              <input required className="input-field" placeholder="e.g. Gen Z home decor lovers"
                value={form.targetAudience} onChange={(e) => setForm({ ...form, targetAudience: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text">Budget</label>
                <input className="input-field" placeholder="₹10,000/mo"
                  value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
              </div>
              <div>
                <label className="label-text">Platform</label>
                <select className="input-field" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
                  <option>Instagram</option>
                  <option>Facebook</option>
                  <option>LinkedIn</option>
                  <option>Google</option>
                  <option>Multi-platform</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label-text">Goal</label>
              <input required className="input-field" placeholder="e.g. Increase online sales by 20%"
                value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {loading ? "Generating..." : "Generate Campaign"}
            </button>
          </form>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card flex h-full min-h-[400px] flex-col items-center justify-center gap-3 text-white/40">
                  <Loader2 size={24} className="animate-spin text-accent-400" />
                  Crafting your campaign strategy...
                </motion.div>
              )}

              {!loading && !output && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card flex h-full min-h-[400px] flex-col items-center justify-center gap-2 text-center text-white/30">
                  <Sparkles size={28} />
                  <p>Fill in the form to generate your campaign.</p>
                </motion.div>
              )}

              {!loading && output && (
                <motion.div key="output" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                  <ResultCard title="Campaign Strategy" content={output.campaignStrategy} onCopy={() => copyText(output.campaignStrategy, "strategy")} copied={copied === "strategy"} />
                  <ResultCard title="Instagram Caption" content={output.instagramCaption} onCopy={() => copyText(output.instagramCaption, "ig")} copied={copied === "ig"} />
                  <ResultCard title="Facebook Ad" content={output.facebookAd} onCopy={() => copyText(output.facebookAd, "fb")} copied={copied === "fb"} />
                  <ResultCard title="LinkedIn Post" content={output.linkedinPost} onCopy={() => copyText(output.linkedinPost, "li")} copied={copied === "li"} />
                  <ResultCard
                    title="Google Ad Copy"
                    content={`${output.googleAdCopy.headline}\n${output.googleAdCopy.description}`}
                    onCopy={() => copyText(`${output.googleAdCopy.headline}\n${output.googleAdCopy.description}`, "google")}
                    copied={copied === "google"}
                  />
                  <div className="glass-card grid grid-cols-2 gap-4">
                    <div>
                      <span className="label-text">CTA</span>
                      <p className="text-sm">{output.cta}</p>
                    </div>
                    <div>
                      <span className="label-text">Best Posting Time</span>
                      <p className="text-sm">{output.bestPostingTime}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="label-text">Hashtags</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {output.hashtags.map((tag) => (
                          <span key={tag} className="rounded-full bg-accent-500/15 px-3 py-1 text-xs text-accent-300">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

function ResultCard({ title, content, onCopy, copied }: { title: string; content: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="glass-card">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white/80">{title}</h4>
        <button onClick={onCopy} className="text-white/40 hover:text-white">
          {copied ? <Check size={14} className="text-mint-500" /> : <Copy size={14} />}
        </button>
      </div>
      <p className="whitespace-pre-line text-sm text-white/60">{content}</p>
    </div>
  );
}
