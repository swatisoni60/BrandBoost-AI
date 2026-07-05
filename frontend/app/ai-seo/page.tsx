"use client";

import { useState } from "react";
import { Search, Loader2, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";

interface SEOOutput {
  productDescription: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  blogTopics: string[];
  landingPageCopy: string;
}

export default function AISEOPage() {
  const [form, setForm] = useState({ product: "", keywords: "" });
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<SEOOutput | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput(null);
    try {
      const data = await api.post<{ campaign: { output: SEOOutput } }>("/ai/seo-assistant", form);
      setOutput(data.campaign.output);
      toast.success("SEO content generated!");
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
        <Navbar title="AI SEO Assistant" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <form onSubmit={handleGenerate} className="glass-card flex flex-col gap-4 lg:col-span-2">
            <div className="mb-1 flex items-center gap-2 text-accent-300">
              <Search size={18} />
              <h3 className="font-display font-semibold text-white">Product Details</h3>
            </div>

            <div>
              <label className="label-text">Product</label>
              <input required className="input-field" placeholder="e.g. Organic cold-pressed almond oil"
                value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} />
            </div>
            <div>
              <label className="label-text">Seed keywords (optional)</label>
              <input className="input-field" placeholder="e.g. organic skincare, cold pressed oil"
                value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              {loading ? "Generating..." : "Generate SEO Content"}
            </button>
          </form>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card flex h-full min-h-[400px] flex-col items-center justify-center gap-3 text-white/40">
                  <Loader2 size={24} className="animate-spin text-accent-400" />
                  Optimizing for search...
                </motion.div>
              )}

              {!loading && !output && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card flex h-full min-h-[400px] flex-col items-center justify-center gap-2 text-center text-white/30">
                  <Search size={28} />
                  <p>Enter a product to generate SEO content.</p>
                </motion.div>
              )}

              {!loading && output && (
                <motion.div key="output" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                  <ResultCard title="Product Description" content={output.productDescription} onCopy={() => copyText(output.productDescription, "desc")} copied={copied === "desc"} />
                  <div className="glass-card grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <span className="label-text">Meta Title</span>
                      <p className="text-sm">{output.metaTitle}</p>
                    </div>
                    <div>
                      <span className="label-text">Meta Description</span>
                      <p className="text-sm">{output.metaDescription}</p>
                    </div>
                  </div>
                  <div className="glass-card">
                    <span className="label-text">Keywords</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {output.keywords.map((k) => (
                        <span key={k} className="rounded-full bg-accent-500/15 px-3 py-1 text-xs text-accent-300">{k}</span>
                      ))}
                    </div>
                  </div>
                  <div className="glass-card">
                    <span className="label-text">Blog Topic Ideas</span>
                    <ul className="mt-2 flex flex-col gap-1.5 text-sm text-white/60">
                      {output.blogTopics.map((t) => (
                        <li key={t}>• {t}</li>
                      ))}
                    </ul>
                  </div>
                  <ResultCard title="Landing Page Copy" content={output.landingPageCopy} onCopy={() => copyText(output.landingPageCopy, "landing")} copied={copied === "landing"} />
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
