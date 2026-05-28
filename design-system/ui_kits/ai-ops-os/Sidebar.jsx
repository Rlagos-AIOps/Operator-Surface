// Sidebar.jsx — fixed left rail with dimmed coming-soon items
const Sidebar = ({ active, onNav, compact }) => {
  const items = [
    { id: 'inbox',    icon: 'inbox',         label: 'Inbox',       count: 8,   active: true },
    { id: 'pipeline', icon: 'trending-up',   label: 'Pipeline',    soon: true },
    { id: 'clients',  icon: 'users',         label: 'Clients',     soon: true },
    { id: 'scoping',  icon: 'file-text',     label: 'Scoping',     soon: true },
    { id: 'pricing',  icon: 'dollar-sign',   label: 'ROI Pricing', soon: true },
    { id: 'agents',   icon: 'bot',           label: 'Agents',      count: 1, live: true, active: true },
  ];
  return (
    <aside style={{
      width: compact ? 72 : 260, background: 'var(--bg-deep)',
      borderRight: '1px solid rgba(244,241,232,0.08)',
      padding: compact ? '20px 10px' : '20px 14px',
      display: 'flex', flexDirection: 'column', gap: 4, height: '100vh', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 10px 18px' }}>
        <img src="../../assets/mark.svg" alt="" style={{ height: 28 }}/>
        {!compact && (
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18 }}>AI Ops</div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--lime)' }}>OPERATOR&nbsp;OS</div>
          </div>
        )}
      </div>
      {!compact && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--muted)', padding: '12px 10px 6px' }}>WORKSPACE</div>}
      {items.map(it => {
        const isActive = active === it.id;
        const isDimmed = it.soon;
        return (
          <button key={it.id} onClick={() => !isDimmed && onNav(it.id)}
            title={isDimmed ? 'Coming soon' : ''}
            disabled={isDimmed}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
              background: isActive ? 'var(--lime)' : 'transparent',
              color: isActive ? 'var(--ink)' : 'var(--muted)',
              opacity: isDimmed ? 0.45 : 1,
              cursor: isDimmed ? 'not-allowed' : 'pointer',
              border: 'none', padding: compact ? '10px' : '10px 16px', borderRadius: 9999,
              fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500,
              boxShadow: isActive ? 'inset 0 0 0 1px rgba(217,232,121,0.45), inset 0 1px 0 rgba(255,255,255,0.06)' : 'none',
              justifyContent: compact ? 'center' : 'flex-start',
              position: 'relative',
            }}>
            <i data-lucide={it.icon} style={{ width: 18, height: 18, flexShrink: 0 }}></i>
            {!compact && <span style={{ flex: 1 }}>{it.label}</span>}
            {!compact && it.soon && (
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--muted)' }}>SOON</span>
            )}
            {!compact && it.count !== undefined && (
              <span style={{
                fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
                color: it.live ? 'var(--ink)' : 'var(--muted)',
                background: it.live ? 'var(--volt)' : 'rgba(244,241,232,0.06)',
                padding: '2px 7px', borderRadius: 9999,
                boxShadow: it.live ? '0 0 0 3px rgba(200,249,2,0.20), 0 0 12px rgba(200,249,2,0.45)' : 'none',
              }}>{it.count}</span>
            )}
          </button>
        );
      })}
      <div style={{ flex: 1 }}></div>
      {!compact && (
        <div style={{
          background: 'var(--surface)', borderRadius: 10, padding: '12px 14px',
          border: '1px solid var(--surface-edge)', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 9999, background: 'var(--volt)',
            boxShadow: '0 0 0 3px rgba(200,249,2,0.25), 0 0 10px rgba(200,249,2,0.6)',
            animation: 'pulse 1.4s ease-in-out infinite',
          }}></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Triage agent</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Working · 8 drafts</div>
          </div>
        </div>
      )}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }`}</style>
    </aside>
  );
};
window.Sidebar = Sidebar;
