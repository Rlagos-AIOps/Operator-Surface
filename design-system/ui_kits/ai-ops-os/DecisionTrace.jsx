// DecisionTrace.jsx — components for the per-DM decision detail view
// Reuses: CategoryBadge, ConfidenceMeter (from QueueRow.jsx) + dm-data.js

// ─── Section eyebrow with optional pulse dot ───
const TraceEyebrow = ({ label, pulse, accent = 'var(--lime)' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
    {pulse && (
      <div style={{
        width: 6, height: 6, borderRadius: 9999, background: 'var(--volt)',
        boxShadow: '0 0 8px var(--volt)', animation: 'pulse 1.4s ease-in-out infinite',
      }}/>
    )}
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
      textTransform: 'uppercase', color: accent,
    }}>{label}</span>
  </div>
);

// ─── Section 1: Original inbound DM ───
const OriginalDM = ({ thread, dense }) => (
  <section style={{ marginBottom: dense ? 24 : 32 }}>
    <TraceEyebrow label={`From ${thread.name}`}/>
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
    }}>
      <div style={{
        width: dense ? 32 : 40, height: dense ? 32 : 40, borderRadius: 9999,
        background: 'var(--surface-2)', color: 'var(--paper)', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-serif)', fontSize: dense ? 14 : 17,
        marginTop: 4,
      }}>{thread.name[0]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6,
          display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, color: 'var(--paper-text)' }}>{thread.name}</span>
          <span>·</span>
          <span>{thread.role}</span>
          <span>·</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{thread.time} · LinkedIn DM</span>
        </div>
        <div style={{
          background: 'var(--paper)', color: 'var(--ink)',
          borderRadius: '60px 15px 60px 15px',
          padding: dense ? '14px 22px' : '18px 26px',
          fontSize: dense ? 14 : 16, lineHeight: 1.55,
          maxWidth: dense ? '100%' : 580,
          boxShadow: '0 1px 0 rgba(10,20,16,0.20)',
        }}>{thread.fullMessage || thread.preview}</div>
      </div>
    </div>
  </section>
);

// ─── Section 2: Thought bubble — signature element ───
// Cloud-shaped dotted lime container with reasoning bullets inside.
const ThoughtBubble = ({ items = [], dense }) => (
  <section style={{ marginBottom: dense ? 24 : 32, position: 'relative' }}>
    <TraceEyebrow label="Agent thinking" pulse/>
    <div style={{ position: 'relative', paddingLeft: dense ? 0 : 52 }}>
      {/* Trailing thought-dots leading into the bubble (desktop only) */}
      {!dense && (
        <div style={{
          position: 'absolute', left: 18, top: 4,
          display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: 9999,
            border: '1.5px dotted var(--lime)', background: 'transparent' }}/>
          <div style={{ width: 9, height: 9, borderRadius: 9999,
            border: '1.5px dotted var(--lime)', background: 'transparent' }}/>
        </div>
      )}
      <div style={{
        position: 'relative',
        background: 'rgba(217,232,121,0.04)',
        border: '1.5px dotted var(--lime)',
        borderRadius: '32px 32px 32px 8px',
        padding: dense ? '18px 20px' : '22px 28px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 14,
          paddingBottom: 12,
          borderBottom: '1px dashed rgba(217,232,121,0.30)',
        }}>
          <i data-lucide="sparkles" style={{ width: 14, height: 14, color: 'var(--lime)' }}></i>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--lime)' }}>Reasoning chain</span>
          <span style={{ flex: 1 }}/>
          <span style={{ fontSize: 11, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>
            {items.length} signals · 380ms
          </span>
        </div>
        <ul style={{
          margin: 0, padding: 0, listStyle: 'none',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {items.map((it, i) => (
            <li key={i} style={{
              display: 'grid',
              gridTemplateColumns: '20px 110px 1fr',
              gap: 12, alignItems: 'baseline',
              fontSize: dense ? 13 : 14, lineHeight: 1.45,
              color: 'var(--paper-text)',
            }}>
              <span style={{
                fontFamily: 'var(--font-num)', fontVariantNumeric: 'tabular-nums',
                fontSize: 11, color: 'var(--muted)',
              }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.10em',
                textTransform: 'uppercase', color: 'var(--lime)',
              }}>{it.kind}</span>
              <span style={{ color: 'var(--paper-text)' }}>{it.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

// ─── Section 3: Classification verdict card ───
const ClassificationCard = ({ thread, dense }) => {
  const c = window.DM_CATEGORIES[thread.cat];
  const pct = Math.round(thread.confidence * 100);
  return (
    <section style={{ marginBottom: dense ? 24 : 32 }}>
      <TraceEyebrow label="Classification"/>
      <div style={{
        background: 'var(--surface)', borderRadius: 14,
        border: '1px solid var(--surface-edge)',
        padding: dense ? '20px 22px' : '24px 28px',
        display: 'grid',
        gridTemplateColumns: dense ? '1fr' : '1fr auto',
        gap: dense ? 18 : 32, alignItems: 'center',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: c.bg, border: `1px solid ${c.border}`,
            padding: '4px 10px 4px 8px', borderRadius: 6,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.16em',
            color: c.color, marginBottom: 12,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: 9999, background: c.color }}/>
            {c.label}
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: dense ? 28 : 36, lineHeight: 1.05, letterSpacing: '-0.025em',
            marginBottom: 6,
          }}>{thread.summary || c.label.charAt(0) + c.label.slice(1).toLowerCase()}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
            {thread.summarySub || 'Recommended action: send drafted reply.'}
          </div>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: dense ? 'flex-start' : 'flex-end',
          borderLeft: dense ? 'none' : '1px solid var(--surface-edge)',
          paddingLeft: dense ? 0 : 28, paddingTop: dense ? 14 : 0,
          borderTop: dense ? '1px solid var(--surface-edge)' : 'none',
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
            color: 'var(--muted)', marginBottom: 4,
          }}>CONFIDENCE</div>
          <div style={{
            fontFamily: 'var(--font-num)', fontVariantNumeric: 'tabular-nums lining-nums',
            fontFeatureSettings: '"tnum" 1, "lnum" 1',
            fontSize: dense ? 56 : 72, lineHeight: 1, fontWeight: 700,
            letterSpacing: '-0.03em', color: 'var(--paper-text)',
            display: 'flex', alignItems: 'baseline', gap: 4,
          }}>
            {pct}<span style={{ fontSize: dense ? 22 : 28, color: 'var(--muted)', fontWeight: 500 }}>%</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            marginTop: 6, fontSize: 11, color: 'var(--lime)',
          }}>
            <i data-lucide="trending-up" style={{ width: 12, height: 12 }}></i>
            <span>High confidence</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Section 4: Drafted reply (right-aligned bubble) ───
const DraftedReply = ({ thread = {}, dense }) => {
  const tokens = (thread.draft || '').split(/\s+/).length;
  const readSec = Math.max(3, Math.round((thread.draft || '').length / 16));
  return (
    <section style={{ marginBottom: dense ? 24 : 32 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
      }}>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--lime)',
        }}>Suggested reply</span>
        <span style={{ flex: 1 }}/>
        <span style={{ fontSize: 11, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums',
          display: 'flex', gap: 12, alignItems: 'center' }}>
          <span>{tokens} tokens</span>
          <span style={{ width: 3, height: 3, borderRadius: 9999, background: 'var(--muted)' }}/>
          <span>{readSec}s read</span>
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{
          background: 'linear-gradient(135deg,#D9E879,#C8F902)',
          color: 'var(--ink)',
          borderRadius: '15px 60px 15px 60px',
          padding: dense ? '14px 22px' : '18px 26px',
          fontSize: dense ? 14 : 16, lineHeight: 1.55,
          maxWidth: dense ? '92%' : 580,
          boxShadow: '0 8px 24px rgba(217,232,121,0.18), 0 0 0 1px rgba(200,249,2,0.40)',
        }}>{thread.draft}</div>
      </div>
      <div style={{
        display: 'flex', justifyContent: 'flex-end', marginTop: 8,
      }}>
        <button style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--muted)', fontSize: 11, fontFamily: 'var(--font-sans)',
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 8px',
        }}>
          <i data-lucide="refresh-ccw" style={{ width: 12, height: 12 }}></i>
          <span>Regenerate · 3 alternates</span>
        </button>
      </div>
    </section>
  );
};

// ─── Section 5: Decision timeline (horizontal stepper) ───
const DecisionTimeline = ({ steps = [], dense }) => (
  <section style={{ marginBottom: dense ? 20 : 28 }}>
    <TraceEyebrow label="Decision timeline"/>
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
      gap: 0,
      background: 'var(--bg-deep)',
      border: '1px solid rgba(244,241,232,0.08)',
      borderRadius: 12,
      padding: dense ? '16px 14px' : '20px 22px',
      position: 'relative',
    }}>
      {steps.map((s, i) => {
        const isLast = i === steps.length - 1;
        const isActive = s.state === 'active';
        const isPending = s.state === 'pending';
        const dotColor = isPending ? 'rgba(244,241,232,0.20)'
          : isActive ? 'var(--volt)' : 'var(--lime)';
        return (
          <div key={i} style={{ position: 'relative', minWidth: 0 }}>
            {/* Connector */}
            {!isLast && (
              <div style={{
                position: 'absolute',
                left: 'calc(50% + 10px)', right: '-50%',
                top: 7, height: 1.5,
                background: isPending
                  ? 'rgba(244,241,232,0.10)'
                  : 'var(--lime)',
                borderTop: isPending ? '1.5px dashed rgba(244,241,232,0.20)' : 'none',
                zIndex: 0,
              }}/>
            )}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              position: 'relative', zIndex: 1,
            }}>
              <div style={{
                width: 14, height: 14, borderRadius: 9999,
                background: dotColor,
                boxShadow: isActive
                  ? '0 0 0 4px rgba(200,249,2,0.20), 0 0 16px rgba(200,249,2,0.55)'
                  : isPending ? 'inset 0 0 0 1px rgba(244,241,232,0.30)' : 'none',
                animation: isActive ? 'pulse 1.4s ease-in-out infinite' : 'none',
                marginBottom: 10,
              }}/>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: isPending ? 'var(--muted)' : 'var(--paper-text)',
              }}>{s.label}</div>
              <div style={{
                fontSize: 11, color: 'var(--muted)',
                fontVariantNumeric: 'tabular-nums', marginTop: 2,
              }}>{s.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

// ─── Footer action bar ───
const TraceFooter = ({ dense }) => {
  const [rejectOpen, setRejectOpen] = React.useState(false);
  const reasons = [
    'Wrong classification',
    'Off-tone',
    'Not ready to reply',
    'Other',
  ];
  return (
  <div style={{
    display: 'flex', gap: dense ? 8 : 10, alignItems: 'center',
    flexWrap: dense ? 'wrap' : 'nowrap',
    position: 'relative',
  }}>
    <button style={{
      flex: dense ? '1 1 100%' : '0 0 auto',
      height: dense ? 48 : 44,
      padding: '0 22px', borderRadius: 12,
      background: 'var(--lime)', color: 'var(--ink)', border: 'none',
      fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: 'pointer',
      boxShadow: '0 8px 20px rgba(217,232,121,0.25)',
      order: dense ? 1 : 0,
    }}>
      <i data-lucide="send" style={{ width: 16, height: 16 }}></i>
      <span>Approve & Send</span>
    </button>
    <button style={{
      height: dense ? 44 : 44, padding: '0 16px', borderRadius: 10,
      background: 'transparent', color: 'var(--paper-text)',
      border: '1px solid rgba(244,241,232,0.20)', cursor: 'pointer',
      fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
      display: 'flex', alignItems: 'center', gap: 6,
      order: dense ? 2 : 0,
    }}>
      <i data-lucide="pencil" style={{ width: 14, height: 14 }}></i>
      <span>Edit</span>
    </button>
    <div style={{ position: 'relative', order: dense ? 3 : 0 }}>
      <button onClick={() => setRejectOpen(o => !o)} style={{
        height: dense ? 44 : 44, padding: '0 14px', borderRadius: 10,
        background: rejectOpen ? 'var(--surface-2)' : 'transparent',
        color: 'var(--muted)',
        border: '1px solid rgba(244,241,232,0.16)', cursor: 'pointer',
        fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <i data-lucide="x" style={{ width: 14, height: 14 }}></i>
        <span>Reject</span>
        <i data-lucide="chevron-down" style={{ width: 12, height: 12, opacity: 0.6,
          transform: rejectOpen ? 'rotate(180deg)' : 'none', transition: 'transform 180ms' }}></i>
      </button>
      {rejectOpen && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)', left: 0,
          minWidth: 200,
          background: 'var(--surface)',
          border: '1px solid var(--surface-edge)',
          borderRadius: 10,
          padding: 6,
          boxShadow: '0 18px 40px rgba(10,20,16,0.45), 0 0 0 1px rgba(58,128,82,0.50)',
          zIndex: 50,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
            color: 'var(--muted)', padding: '8px 12px 6px',
          }}>REJECT REASON</div>
          {reasons.map((r, i) => (
            <button key={i} onClick={() => setRejectOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', textAlign: 'left',
              padding: '10px 12px', borderRadius: 6,
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--paper-text)',
              fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244,241,232,0.06)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <i data-lucide={
                r === 'Wrong classification' ? 'tag' :
                r === 'Off-tone' ? 'message-square-warning' :
                r === 'Not ready to reply' ? 'clock' : 'more-horizontal'
              } style={{ width: 14, height: 14, color: 'var(--muted)' }}></i>
              <span>{r}</span>
            </button>
          ))}
        </div>
      )}
    </div>
    <span style={{ flex: 1 }}/>
    {!dense && (
      <button style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'var(--muted)', fontSize: 12, fontFamily: 'var(--font-sans)',
        textDecoration: 'underline', textUnderlineOffset: 3,
        textDecorationColor: 'rgba(143,168,154,0.4)',
      }}>Override classification</button>
    )}
  </div>
  );
};

window.OriginalDM = OriginalDM;
window.ThoughtBubble = ThoughtBubble;
window.ClassificationCard = ClassificationCard;
window.DraftedReply = DraftedReply;
window.DecisionTimeline = DecisionTimeline;
window.TraceFooter = TraceFooter;
window.TraceEyebrow = TraceEyebrow;
