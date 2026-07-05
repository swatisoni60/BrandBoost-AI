"use client";

import { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, TrendingUp, Users, Target, Percent } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import DashboardCard from "@/components/DashboardCard";
import { RevenueTrendChart, CategoryPieChart } from "@/components/Charts";
import { api } from "@/lib/api";

interface Summary {
  revenue: number;
  totalSales: number;
  orders: number;
  conversionRate: number;
  visitors: number;
  activeCampaigns: number;
  roi: number;
  growthPercentage: number;
}

interface TrendPoint {
  month: string;
  revenue: number;
  sales: number;
}

interface CategoryPoint {
  category: string;
  count: number;
  revenue: number;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [breakdown, setBreakdown] = useState<CategoryPoint[]>([]);

  useEffect(() => {
    api.get<Summary>("/dashboard/summary").then(setSummary).catch(() => {});
    api
      .get<{ trend: TrendPoint[] }>("/dashboard/revenue-trend")
      .then((d) => setTrend(d.trend))
      .catch(() => {});
    api
      .get<{ breakdown: CategoryPoint[] }>("/dashboard/category-breakdown")
      .then((d) => setBreakdown(d.breakdown))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen md:pl-64">
      <Sidebar />
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-10 md:py-10">
        <Navbar title="Dashboard" />

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <DashboardCard
            label="Revenue"
            value={`₹${(summary?.revenue ?? 0).toLocaleString()}`}
            change={summary?.growthPercentage}
            icon={DollarSign}
            delay={0}
          />
          <DashboardCard
            label="Total Sales"
            value={(summary?.totalSales ?? 0).toLocaleString()}
            icon={ShoppingCart}
            delay={0.05}
          />
          <DashboardCard
            label="Conversion Rate"
            value={`${summary?.conversionRate ?? 0}%`}
            icon={Percent}
            delay={0.1}
          />
          <DashboardCard
            label="Visitors"
            value={(summary?.visitors ?? 0).toLocaleString()}
            icon={Users}
            delay={0.15}
          />
          <DashboardCard
            label="Active Campaigns"
            value={(summary?.activeCampaigns ?? 0).toString()}
            icon={Target}
            delay={0.2}
          />
          <DashboardCard
            label="ROI"
            value={`${summary?.roi ?? 0}x`}
            icon={TrendingUp}
            delay={0.25}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="glass-card lg:col-span-2">
            <h3 className="mb-4 font-display font-semibold">Revenue Trend</h3>
            <RevenueTrendChart data={trend} />
          </div>
          <div className="glass-card">
            <h3 className="mb-4 font-display font-semibold">Revenue by Category</h3>
            <CategoryPieChart data={breakdown} />
          </div>
        </div>
      </main>
    </div>
  );
}
