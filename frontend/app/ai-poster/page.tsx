"use client";

import { useState } from "react";
import { Image as ImageIcon, Loader2, Download, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";

interface PosterOutput {
  imageUrl: string;
  prompt: string;
}

const STYLES = ["Modern Minimalist", "Bold & Vibrant", "Elegant Luxury", "Retro Vintage", "Playful Colorful"];

export default function AIPosterPage() {
  const [form, setForm] = useState({ product: "", style: STYLES[0], tagline: "" });
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<PosterOutput | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setImgLoaded(false);
    setOutput(null);
    try {
      const data = await api.post<{ campaign: { output: PosterOutput } }>("/ai/poster-generator", form);
      setOutput(data.campaign.output);
      toast.success("Poster generated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const link = document.createElement("a");
    link.href = output.imageUrl;
    link.download = `${form.product.replace(/\s+/g, "-").toLowerCase() || "poster"}.jpg`;
    link.target = "_blank";
    link.click();
  };

  return (
    <div className="min-h-screen md:pl-64">
      <Sidebar />
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-10 md:py-10">
        <Navbar title="AI Poster Generator" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <form onSubmit={handleGenerate} className="glass-card flex flex-col gap-4 lg:col-span-2">
            <div className="mb-1 flex items-center gap-2 text-accent-300">
              <ImageIcon size={18} />
              <h3 className="font-display font-semibold text-white">Poster Details</h3>
            </div>

            <div>
              <label className="label-text">Product</label>
              <input required className="input-field" placeholder="e.g. Handmade ceramic mugs"
                value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} />
            </div>
            <div>
              <label className="label-text">Style</label>
              <select className="input-field" value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })}>
                {STYLES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label-text">Tagline (optional)</label>
              <input className="input-field" placeholder="e.g. Sip Happens"
                value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
              {loading ? "Generating..." : "Generate Poster"}
            </button>

            {output && !loading && (
              <div className="flex gap-2">
                <button type="button" onClick={handleGenerate as any} className="btn-ghost flex-1">
                  <RefreshCw size={14} /> Regenerate
                </button>
                <button type="button" onClick={handleDownload} className="btn-ghost flex-1">
                  <Download size={14} /> Download
                </button>
              </div>
            )}
          </form>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card flex h-full min-h-[500px] flex-col items-center justify-center gap-3 text-white/40">
                  <Loader2 size={24} className="animate-spin text-accent-400" />
                  Painting your poster... this can take up to 20s.
                </motion.div>
              )}

              {!loading && !output && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card flex h-full min-h-[500px] flex-col items-center justify-center gap-2 text-center text-white/30">
                  <ImageIcon size={28} />
                  <p>Fill in the form to generate a promotional poster.</p>
                </motion.div>
              )}

              {!loading && output && (
                <motion.div key="output" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card flex flex-col items-center gap-4">
                  {!imgLoaded && (
                    <div className="flex h-[400px] w-full items-center justify-center text-white/30">
                      <Loader2 size={20} className="animate-spin" />
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={output.imageUrl}
                    alt="Generated poster"
                    onLoad={() => setImgLoaded(true)}
                    className={`w-full max-w-md rounded-xl2 border border-white/10 ${imgLoaded ? "block" : "hidden"}`}
                  />
                  <p className="text-center text-xs text-white/30">{output.prompt}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
