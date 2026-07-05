"use client";

import { Bell, Search } from "lucide-react";

export default function Navbar({ title }: { title: string }) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-white/40">Welcome back — here's what's happening today.</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="glass hidden items-center gap-2 rounded-full px-4 py-2 sm:flex">
          <Search size={16} className="text-white/40" />
          <input
            placeholder="Search..."
            className="w-40 bg-transparent text-sm text-white placeholder-white/40 outline-none"
          />
        </div>
        <button className="glass relative flex h-10 w-10 items-center justify-center rounded-full">
          <Bell size={16} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-mint-500" />
        </button>
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent-500 to-mint-500" />
      </div>
    </header>
  );
}
