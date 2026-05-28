export default function Home() {
  return (
    <main className="mx-auto max-w-[1280px] px-s5 py-s8">
      <p className="eyebrow mb-s3">Operator Surface</p>

      <h1 className="font-serif text-h1 text-paper mb-s5">
        See what your agents did. Approve what they want to do next.
      </h1>

      <p className="text-body text-muted max-w-[640px]">
        Your CSM agents are running. This surface shows their work, the
        reasoning behind it, and what needs your decision before they
        execute. Placeholder agents:{" "}
        <span className="text-paper">health-score-recomputer</span>,{" "}
        <span className="text-paper">at-risk-triage</span>,{" "}
        <span className="text-paper">renewal-outreach</span>,{" "}
        <span className="text-paper">data-hygiene-audit</span>,{" "}
        <span className="text-paper">save-plan-drafter</span>.
      </p>

      <div className="mt-s8 grid grid-cols-3 gap-s5">
        <div className="rounded-lg bg-surface p-s5 shadow-e1">
          <p className="eyebrow mb-s2">Today</p>
          <p className="font-serif text-h2 tabular text-paper">12</p>
          <p className="text-small text-muted">decisions made</p>
        </div>
        <div className="rounded-lg bg-surface p-s5 shadow-e1">
          <p className="eyebrow mb-s2">Pending</p>
          <p className="font-serif text-h2 tabular text-lime">3</p>
          <p className="text-small text-muted">need your review</p>
        </div>
        <div className="rounded-lg bg-surface p-s5 shadow-e1">
          <p className="eyebrow mb-s2">Connected</p>
          <p className="font-serif text-h2 tabular text-paper">4 / 4</p>
          <p className="text-small text-muted">integrations live</p>
        </div>
      </div>
    </main>
  );
}
