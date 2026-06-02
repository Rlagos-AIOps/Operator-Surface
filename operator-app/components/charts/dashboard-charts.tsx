"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const WEEK = [
  { day: "Mon", leads: 12, qualified: 8 },
  { day: "Tue", leads: 19, qualified: 14 },
  { day: "Wed", leads: 15, qualified: 11 },
  { day: "Thu", leads: 22, qualified: 17 },
  { day: "Fri", leads: 28, qualified: 21 },
  { day: "Sat", leads: 8, qualified: 5 },
  { day: "Sun", leads: 14, qualified: 9 },
];

const RESP = [
  { t: "12am", v: 145 },
  { t: "4am", v: 180 },
  { t: "8am", v: 95 },
  { t: "12pm", v: 118 },
  { t: "4pm", v: 88 },
  { t: "8pm", v: 108 },
];

const tick = { fill: "var(--color-muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" };
const axis = { tickLine: false, axisLine: false, tick } as const;

function ChartTip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number | string; dataKey?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[color:var(--surface-edge)] bg-popover px-3 py-2 shadow-[var(--shadow-2)]">
      <p className="eyebrow text-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="num mt-1 font-mono text-xs text-muted-foreground">
          {p.name} : <span className="text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export function WeeklyLeadsChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={WEEK} margin={{ top: 8, right: 4, bottom: 0, left: -16 }} barGap={3}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
        <XAxis dataKey="day" {...axis} />
        <YAxis {...axis} domain={[0, 28]} ticks={[0, 7, 14, 21, 28]} width={36} />
        <Tooltip content={<ChartTip />} cursor={{ fill: "var(--color-surface-2)" }} />
        {/* isAnimationActive off: charts must render instantly + stay correct
            on every resize (no empty→fill entrance flicker). Interactivity
            lives in the hover Tooltip + cursor, not the entrance animation. */}
        <Bar
          dataKey="leads"
          name="leads"
          fill="var(--color-primary)"
          radius={[4, 4, 0, 0]}
          maxBarSize={16}
          isAnimationActive={false}
        />
        <Bar
          dataKey="qualified"
          name="qualified"
          fill="var(--color-primary)"
          fillOpacity={0.4}
          radius={[4, 4, 0, 0]}
          maxBarSize={16}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ResponseTimeChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={RESP} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="respFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.16} />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
        <XAxis dataKey="t" {...axis} />
        <YAxis {...axis} domain={[0, 180]} ticks={[0, 45, 90, 135, 180]} width={44} />
        <Tooltip content={<ChartTip />} cursor={{ stroke: "var(--color-surface-edge)" }} />
        {/* Bright green line + data dots — readable on the emerald, green-spectrum,
            no signal-accent colors. (The murky filled green area didn't read.)
            Animation off, so dots sit at their points — no stranding. */}
        <Area
          type="monotone"
          dataKey="v"
          name="minutes"
          stroke="var(--color-primary)"
          strokeWidth={2.75}
          fill="url(#respFill)"
          dot={{ r: 4, fill: "var(--color-primary)", strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "var(--color-primary)", strokeWidth: 0 }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
