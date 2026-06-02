// Mock data for the LinkedIn Inbound Triage operator surface.
// Content + intent scores mirror the operator-surface reference screenshot.

export type Intent = "high" | "mid" | "cold";

export interface Lead {
  id: string;
  name: string;
  role: string;
  company: string;
  intent: Intent;
  score: number; // 0-100 intent score shown on the chip
  preview: string; // one-line preview in the queue
  time: string; // relative timestamp
  stage: string; // pipeline stage chip, e.g. "Stage 02 · Qualify"
  message: string; // full inbound message (human bubble)
  reasoning: string; // agent reasoning (dotted-lime bubble)
  draft: string; // agent-drafted reply (composer)
  confidence: number; // 0-1
  tokens: number; // tokens used to draft
}

export interface Metric {
  label: string;
  value: string;
  sub: string;
  tone: "default" | "live" | "paper";
}

export const METRICS: Metric[] = [
  { label: "Pipeline", value: "42", sub: "active threads", tone: "default" },
  {
    label: "Agent · active",
    value: "7",
    sub: "drafts pending review",
    tone: "live",
  },
  {
    label: "Avg response",
    value: "2h 14m",
    sub: "↓ 38% this week",
    tone: "default",
  },
  {
    label: "ROI · locked",
    value: "$4,200",
    sub: "monthly · 3.2× est.",
    tone: "paper",
  },
];

export const LEADS: Lead[] = [
  {
    id: "maya",
    name: "Maya Okafor",
    role: "Head of RevOps",
    company: "Linnet Health",
    intent: "high",
    score: 84,
    preview: "Saw your post on AI ops. Quick chat?",
    time: "12m",
    stage: "Stage 02 · Qualify",
    message:
      "Saw your post on AI ops for inbound triage. We get ~200 LinkedIn DMs / week and miss most of them. Open to a quick chat?",
    reasoning:
      "Intent score 0.84 · Persona match (RevOps · mid-market) · Mentions concrete pain (volume + miss rate). Worth a fast reply with two scoping qs.",
    draft:
      "Happy to chat. Two quick questions before we book time: (1) what's your average response time today, and (2) is the bottleneck triage, drafting, or both? I'll send a 20-min slot once you reply.",
    confidence: 0.84,
    tokens: 312,
  },
  {
    id: "devon",
    name: "Devon Park",
    role: "Founder",
    company: "Twosigma Labs",
    intent: "mid",
    score: 62,
    preview: "How does pricing work for a 2-person team?",
    time: "38m",
    stage: "Stage 01 · Intake",
    message:
      "How does pricing work for a 2-person team? We're tiny but drowning in inbound and can't keep up.",
    reasoning:
      "Intent score 0.62 · Small team · Price-sensitive · No urgency signal. Send a clear tiered answer with ROI framing, hold the call.",
    draft:
      "For a 2-person team we start at the Solo tier — flat monthly, no per-seat. I'll send the ROI breakdown so you can see payback before we book anything.",
    confidence: 0.71,
    tokens: 188,
  },
  {
    id: "aileen",
    name: "Aileen Cruz",
    role: "COO",
    company: "Northwind",
    intent: "high",
    score: 91,
    preview: "We need this yesterday. Can you scope by Fri…",
    time: "1h",
    stage: "Stage 02 · Qualify",
    message:
      "We need this yesterday. Can you scope a pilot by Friday? The board wants a plan for inbound automation this quarter.",
    reasoning:
      "Intent score 0.91 · Decision-maker (COO) · Explicit deadline · High urgency. Prioritize — reply within the hour with a concrete scoping path.",
    draft:
      "Friday works. I'll send a one-page pilot scope today and hold 30 min Thursday to lock it. What's the single inbound channel hurting most right now?",
    confidence: 0.89,
    tokens: 274,
  },
  {
    id: "ben",
    name: "Ben Sato",
    role: "PM",
    company: "Casewell",
    intent: "cold",
    score: 34,
    preview: "Just kicking the tires.",
    time: "2h",
    stage: "Stage 01 · Intake",
    message:
      "Just kicking the tires for now. Not sure we're ready to buy anything yet — still figuring out the problem.",
    reasoning:
      "Intent score 0.34 · Low buying signal · No concrete pain · Early. Nurture with a teardown, don't push a call.",
    draft:
      "No rush. I'll send a short teardown of how teams like yours use this — read it whenever, and ping me if a use case clicks.",
    confidence: 0.78,
    tokens: 142,
  },
  {
    id: "priya",
    name: "Priya Rangan",
    role: "VP Growth",
    company: "Halcyon",
    intent: "mid",
    score: 71,
    preview: "Curious about the multi-agent delivery model.",
    time: "3h",
    stage: "Stage 02 · Qualify",
    message:
      "Curious about the multi-agent delivery model — how many agents are involved, and who reviews the output before it goes out?",
    reasoning:
      "Intent score 0.71 · Technical curiosity · Mid-funnel · Answer the architecture question plainly, then offer a live demo.",
    draft:
      "Good question. One triage agent flags and drafts; you approve before anything sends — nothing goes out unreviewed. Want a 15-min demo on a live inbox?",
    confidence: 0.83,
    tokens: 207,
  },
  {
    id: "tom",
    name: "Tom Beech",
    role: "Recruiter",
    company: "Halyard Search",
    intent: "cold",
    score: 18,
    preview: "Are you open to opportunities?",
    time: "5h",
    stage: "Stage 00 · New",
    message:
      "Are you open to opportunities? I have several leadership roles in the AI space that could be a fit.",
    reasoning:
      "Intent score 0.18 · Generic recruiter outreach · No personalization · Off-pipeline. Polite decline is the default.",
    draft:
      "Appreciate the note — not exploring roles right now. I'll reach out if that changes.",
    confidence: 0.92,
    tokens: 96,
  },
];

// At-a-glance thread tags surfaced in the inbound queue.
export const LEAD_TAGS: Record<string, string[]> = {
  maya: ["Lead", "Stage 02"],
  devon: ["Lead", "Pricing"],
  aileen: ["Lead", "Call back"],
  ben: ["Lead", "Nurture"],
  priya: ["Lead", "Demo"],
  tom: ["Recruiter", "New"],
};

export type NavIcon =
  | "inbox"
  | "trending-up"
  | "users"
  | "file-text"
  | "dollar-sign"
  | "bot";

export interface NavItem {
  id: string;
  label: string;
  icon: NavIcon;
  count?: number;
  live?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "inbox", label: "Inbox", icon: "inbox", count: 12 },
  { id: "pipeline", label: "Pipeline", icon: "trending-up", count: 42 },
  { id: "clients", label: "Clients", icon: "users", count: 8 },
  { id: "scoping", label: "Scoping", icon: "file-text" },
  { id: "pricing", label: "ROI Pricing", icon: "dollar-sign" },
  { id: "agents", label: "Agents", icon: "bot", count: 3, live: true },
];
