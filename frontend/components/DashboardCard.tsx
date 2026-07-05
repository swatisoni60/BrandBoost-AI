"use client";

import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface DashboardCardProps {
  label: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  delay?: number;
}

export default function DashboardCard({ label, value, change, icon: Icon, delay = 0 }: DashboardCardProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-white/40">{label}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/15 text-accent-300">
          <Icon size={16} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="font-display text-2xl font-bold">{value}</span>
        {change !== undefined && (
          <span
            className={`flex items-center gap-1 text-xs font-semibold ${
              isPositive ? "text-mint-500" : "text-red-400"
            }`}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
