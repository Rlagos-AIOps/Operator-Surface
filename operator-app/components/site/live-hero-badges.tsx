"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Badge, type Tone } from "./accents";

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const step = (range: number) => Math.round((Math.random() * 2 - 1) * range);

// Pill 1 cycles the three heat colors by its value.
function heatTone(v: number): Tone {
  return v >= 24 ? "hot" : v >= 15 ? "warm" : "cold";
}

export function LiveHeroBadges() {
  // Initial values match SSR; the interval only runs client-side (post-mount).
  const [mom, setMom] = useState(23);
  const [momUp, setMomUp] = useState(true);
  const [handle, setHandle] = useState(14);
  const [handleUp, setHandleUp] = useState(false);
  const [attn, setAttn] = useState(3);

  useEffect(() => {
    const id = setInterval(() => {
      const dM = step(5) || 2;
      setMom((v) => clamp(v + dM, 6, 32));
      setMomUp(dM >= 0);
      const dH = step(3) || -1;
      setHandle((v) => clamp(v + dH, 5, 27));
      setHandleUp(dH > 0); // up = slower handling = bad
      setAttn((v) => clamp(v + step(1), 1, 6));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const MomArrow = momUp ? ArrowUpRight : ArrowDownRight;
  const HandleArrow = handleUp ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* #1 — value cycles the heat colors (hot / warm / cold) */}
      <Badge tone={heatTone(mom)} dot>
        <MomArrow className="size-3" strokeWidth={2.5} /> +<span className="num tabular-nums">{mom}</span>% MoM
      </Badge>
      {/* #2 — green when improving (faster), red when worsening (slower) */}
      <Badge tone={handleUp ? "bad" : "good"} dot>
        <HandleArrow className="size-3" strokeWidth={2.5} /> <span className="num tabular-nums">{handle}</span>s avg handle
      </Badge>
      {/* #3 — stays gray (pending), just a touch brighter */}
      <Badge tone="pending" dot className="border-pending/85 bg-pending/[0.22]">
        <span className="num tabular-nums">{attn}</span> need attention
      </Badge>
    </div>
  );
}
