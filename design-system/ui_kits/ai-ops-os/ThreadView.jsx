// ThreadView.jsx
const Bubble = ({ from, children }) => {
  const base = {
    padding: '14px 22px', maxWidth: 'min(560px, 75%)',
    fontSize: 14, lineHeight: 1.5,
  };
  if (from === 'human') return (
    <div style={{ ...base, alignSelf: 'flex-start', background: 'var(--paper)', color: 'var(--ink)',
      borderRadius: '60px 15px 60px 15px' }}>{children}</div>
  );
  if (from === 'agent') return (
    <div style={{ ...base, alignSelf: 'flex-end', background: 'linear-gradient(135deg,#D9E879,#C8F902)',
      color: 'var(--ink)', borderRadius: '15px 60px 15px 60px' }}>{children}</div>
  );
  return (
    <div style={{ ...base, alignSelf: 'flex-start', background: 'transparent', color: 'var(--paper-text)',
      border: '1.5px dotted var(--lime)', borderRadius: '60px 15px 60px 15px',
      padding: '12px 20px', fontSize: 13 }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--lime)',
        marginRight: 8 }}>REASONING</span>
      {children}
    </div>
  );
};

const ThreadView = ({ lead }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
    <div style={{
      padding: '20px 28px', borderBottom: '1px solid rgba(244,241,232,0.08)',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 9999, background: 'var(--surface-2)', color: 'var(--paper)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-serif)', fontSize: 18,
      }}>{lead.name[0]}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, letterSpacing: '-0.02em' }}>{lead.name}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{lead.role} · {lead.company}</div>
      </div>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'var(--lime)', background: 'rgba(217,232,121,0.10)',
        padding: '5px 10px', borderRadius: 4, border: '1px solid rgba(217,232,121,0.4)',
      }}>STAGE 02 · QUALIFY</span>
    </div>
    <div style={{
      flex: 1, overflow: 'auto', padding: '24px 28px',
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      {lead.thread.map((m, i) => <Bubble key={i} from={m.from}>{m.text}</Bubble>)}
    </div>
  </div>
);
window.ThreadView = ThreadView;
window.Bubble = Bubble;
