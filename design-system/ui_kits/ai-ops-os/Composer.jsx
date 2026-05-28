// Composer.jsx — drafted reply review surface
const Composer = ({ draft, onApprove, onRevise, approved }) => (
  <div style={{
    background: 'var(--surface)', borderTop: '1px solid var(--surface-edge)',
    padding: '18px 28px',
  }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--lime)' }}>
        AGENT&nbsp;DRAFT&nbsp;·&nbsp;READY&nbsp;FOR&nbsp;REVIEW
      </span>
      <span style={{ fontSize: 11, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>
        confidence&nbsp;0.84 · 312&nbsp;tokens
      </span>
    </div>
    <div style={{
      background: 'var(--bg-deep)', border: '1.5px dotted var(--lime)',
      borderRadius: '60px 15px 60px 15px',
      padding: '14px 22px', color: 'var(--paper-text)',
      fontSize: 14, lineHeight: 1.5, marginBottom: 14,
    }}>{draft}</div>
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <button onClick={onApprove} disabled={approved} style={{
        background: approved ? 'var(--volt)' : 'var(--lime)', color: 'var(--ink)', border: 'none',
        padding: '12px 22px', borderRadius: 8, fontFamily: 'var(--font-sans)',
        fontSize: 14, fontWeight: 700, cursor: approved ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: approved ? '0 0 0 4px rgba(200,249,2,0.20), 0 0 24px rgba(200,249,2,0.45)' : 'none',
        transition: 'all 220ms cubic-bezier(0.2, 0.9, 0.2, 1)',
      }}>
        <i data-lucide={approved ? 'check' : 'send'} style={{ width: 16, height: 16 }}></i>
        <span>{approved ? 'Sent' : 'Approve & send'}</span>
      </button>
      <button onClick={onRevise} style={{
        background: 'transparent', color: 'var(--paper-text)',
        border: '1px solid rgba(244,241,232,0.28)', padding: '11px 20px',
        borderRadius: 8, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
      }}>Revise</button>
      <button style={{
        background: 'transparent', color: 'var(--muted)', border: 'none',
        padding: '11px 16px', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
      }}>Reject</button>
      <div style={{ flex: 1 }}></div>
      <button style={{
        background: 'transparent', color: 'var(--muted)', border: '1px solid rgba(244,241,232,0.16)',
        padding: '8px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <i data-lucide="sparkles" style={{ width: 13, height: 13 }}></i>
        <span>Regenerate</span>
      </button>
    </div>
  </div>
);
window.Composer = Composer;
