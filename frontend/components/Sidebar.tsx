"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Sparkles,
  Search,
  Image as ImageIcon,
  LogOut,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { clearToken } from "@/lib/api";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/ai-marketing", label: "AI Marketing", icon: Sparkles },
  { href: "/ai-seo", label: "AI SEO Assistant", icon: Search },
  { href: "/ai-poster", label: "AI Poster Generator", icon: ImageIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  const NavLinks = () => (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-white/10 text-white"
                : "text-white/50 hover:bg-white/5 hover:text-white/90"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar with hamburger button — visible only below md breakpoint */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-white/10 bg-base-900/80 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-mint-500">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display text-base font-bold tracking-tight">BrandBoost</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile slide-in drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col justify-between bg-base-900 p-5 shadow-2xl">
            <div>
              <div className="mb-8 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-mint-500 shadow-glow">
                    <Zap size={18} className="text-white" />
                  </div>
                  <span className="font-display text-lg font-bold tracking-tight">BrandBoost</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/70"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              <NavLinks />
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-red-400"
            >
              <LogOut size={18} />
              Log out
            </button>
          </aside>
        </div>
      )}

      {/* Desktop sidebar — unchanged, visible md and up */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col justify-between border-r border-white/10 bg-base-900/60 backdrop-blur-xl p-5 md:flex">
        <div>
          <div className="mb-10 flex items-center gap-2 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-mint-500 shadow-glow">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">BrandBoost</span>
          </div>
          <NavLinks />
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-red-400"
        >
          <LogOut size={18} />
          Log out
        </button>
      </aside>
    </>
  );
}
