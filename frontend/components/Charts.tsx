"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#7C5CFC", "#2EE6A8", "#FF6B9D", "#FFB86B", "#5CD3FC"];

interface TrendPoint {
  month: string;
  revenue: number;
  sales: number;
}

export function RevenueTrendChart({ data }: { data: TrendPoint[] }) {
  if (!data.length) {
    return <EmptyState message="No revenue data yet — add products to see trends." />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7C5CFC" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="month" stroke="rgba(255,255,255,0.35)" fontSize={12} />
        <YAxis stroke="rgba(255,255,255,0.35)" fontSize={12} />
        <Tooltip
          contentStyle={{
            background: "#15151F",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            fontSize: 13,
          }}
        />
        <Area type="monotone" dataKey="revenue" stroke="#7C5CFC" fill="url(#revenueGradient)" strokeWidth={2.5} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface CategoryPoint {
  category: string;
  revenue: number;
}

export function CategoryPieChart({ data }: { data: CategoryPoint[] }) {
  if (!data.length) {
    return <EmptyState message="No category data yet." />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="revenue"
          nameKey="category"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={3}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#15151F",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            fontSize: 13,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center gap-2 text-center text-sm text-white/30">
      {message}
    </div>
  );
}
