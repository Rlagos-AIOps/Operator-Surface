// LeadQueue.jsx
const LeadQueue = ({ leads, activeId, onSelect }) => (
  <div style={{
    width: 340, background: 'var(--bg-deep)', borderRight: '1px solid rgba(244,241,232,0.08)',
    overflow: 'auto', flexShrink: 0,
  }}>
    <div style={{
      padding: '16px 20px 10px', display: 'flex', alignItems: 'baseline',
      justifyContent: 'space-between',
    }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, letterSpacing: '-0.02em' }}>Inbound queue</div>
      <span style={{ fontSize: 11, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{leads.length}&nbsp;threads</span>
    </div>
    {leads.map(l => (
      <button key={l.id} onClick={() => onSelect(l.id)} style={{
        display: 'block', width: '100%', textAlign: 'left',
        background: activeId === l.id ? 'rgba(166,214,9,0.08)' : 'transparent',
        borderLeft: activeId === l.id ? '2px solid var(--lime)' : '2px solid transparent',
        border: 'none', borderBottom: '1px solid rgba(244,241,232,0.06)',
        padding: '14px 20px', cursor: 'pointer', color: 'var(--paper-text)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 9999, background: 'var(--surface-2)',
            color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-serif)', fontSize: 13,
          }}>{l.name[0]}</div>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{l.name}</div>
          <IntentChip score={l.score}/>
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 38, marginBottom: 4,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.preview}</div>
        <div style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 38, fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.04em' }}>{l.role} · {l.time}</div>
      </button>
    ))}
  </div>
);

const IntentChip = ({ score }) => {
  const tone = score >= 0.75 ? 'high' : score >= 0.4 ? 'mid' : 'cold';
  const styles = {
    high: { bg: 'rgba(200,249,2,0.18)', fg: 'var(--volt)', border: 'rgba(200,249,2,0.45)', label: 'HIGH' },
    mid:  { bg: 'rgba(232,169,28,0.14)', fg: '#E8A91C', border: 'rgba(232,169,28,0.4)', label: 'MID' },
    cold: { bg: 'rgba(244,241,232,0.06)', fg: 'var(--muted)', border: 'rgba(244,241,232,0.16)', label: 'COLD' },
  }[tone];
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
      padding: '3px 7px', borderRadius: 9999,
      background: styles.bg, color: styles.fg, border: `1px solid ${styles.border}`,
      fontVariantNumeric: 'tabular-nums',
    }}>{styles.label}&nbsp;·&nbsp;{Math.round(score * 100)}</span>
  );
};
window.LeadQueue = LeadQueue;
window.IntentChip = IntentChip;
