// TopBar.jsx
const TopBar = () => (
  <header style={{
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '14px 28px', borderBottom: '1px solid rgba(244,241,232,0.08)',
    background: 'var(--bg)',
  }}>
    <div style={{ flex: 1, position: 'relative', maxWidth: 420 }}>
      <i data-lucide="search" style={{
        width: 16, height: 16, position: 'absolute', left: 12, top: '50%',
        transform: 'translateY(-50%)', color: 'var(--muted)'
      }}></i>
      <input placeholder="Search leads, threads, clients" style={{
        width: '100%', background: 'var(--bg-deep)', border: '1px solid rgba(244,241,232,0.08)',
        color: 'var(--paper-text)', padding: '9px 14px 9px 36px', borderRadius: 8,
        fontFamily: 'var(--font-sans)', fontSize: 13,
      }}/>
    </div>
    <div style={{ flex: 1 }}></div>
    <button style={{
      background: 'transparent', color: 'var(--paper-text)',
      border: '1px solid rgba(244,241,232,0.16)', padding: '8px 14px',
      borderRadius: 8, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
      display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
    }}>
      <i data-lucide="filter" style={{ width: 14, height: 14 }}></i>
      <span>High intent</span>
    </button>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'rgba(200,249,2,0.10)', border: '1px solid rgba(200,249,2,0.4)',
      padding: '8px 12px', borderRadius: 9999,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: 9999, background: 'var(--volt)',
        boxShadow: '0 0 8px var(--volt)', animation: 'pulse 1.4s ease-in-out infinite' }}></div>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--volt)' }}>AGENT&nbsp;LIVE</span>
    </div>
    <div style={{ width: 32, height: 32, borderRadius: 9999, background: 'var(--paper)', color: 'var(--ink)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)',
      fontSize: 14, fontWeight: 600 }}>R</div>
  </header>
);
window.TopBar = TopBar;
