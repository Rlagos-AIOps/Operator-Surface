// FilterChips.jsx — category filter row
const FilterChips = ({ active, counts, onChange }) => {
  const chips = [
    { id: 'all', label: 'All' },
    { id: 'investor', label: 'Investor' },
    { id: 'candidate', label: 'Candidate' },
    { id: 'founder-peer', label: 'Founder-Peer' },
    { id: 'vendor', label: 'Vendor' },
    { id: 'noise', label: 'Noise' },
  ];
  return (
    <div style={{
      display: 'flex', gap: 6, overflowX: 'auto',
      padding: '0 0 4px',
      scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
    }}>
      {chips.map(c => {
        const isActive = active === c.id;
        return (
          <button key={c.id} onClick={() => onChange(c.id)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 9999,
            background: isActive ? 'var(--lime)' : 'transparent',
            color: isActive ? 'var(--ink)' : 'var(--paper-text)',
            border: isActive ? 'none' : '1px solid rgba(244,241,232,0.16)',
            fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            <span>{c.label}</span>
            <span style={{
              fontSize: 11, fontVariantNumeric: 'tabular-nums',
              opacity: isActive ? 0.7 : 0.55,
            }}>{counts[c.id] || 0}</span>
          </button>
        );
      })}
    </div>
  );
};
window.FilterChips = FilterChips;
