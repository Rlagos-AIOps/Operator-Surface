// DailyBrief.jsx — Slack DM preview + email preview cards for the 7am brief

// ── Briefing items (top 3 from queue, narrativized) ──
const BRIEF_ITEMS = [
  { id: 't1', sender: 'Aileen Cruz', cat: 'investor',
    line: 'Sequoia partner asking about Series B timeline — active fundraise window',
    priority: 'high' },
  { id: 't3', sender: 'Maya Okafor', cat: 'founder-peer',
    line: 'Asking for an intro to Sarah at Index — your portfolio overlap',
    priority: null },
  { id: 't2', sender: 'Devon Park', cat: 'candidate',
    line: 'Senior eng, ex-Stripe — strong fit for the open role',
    priority: null },
];

// Inline mark logo (mirrors assets/mark.svg) for portability
const AgentMarkSVG = ({ size = 36 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} style={{ flexShrink: 0 }}>
    <rect x="2" y="2" width="60" height="60" rx="10" fill="#1E5631"/>
    <rect x="2" y="2" width="60" height="60" rx="10" fill="none" stroke="#3A8052" strokeWidth="1"/>
    <path d="M16 48 L30 18 L44 48 Z" fill="#D9E879"/>
    <circle cx="44" cy="48" r="4" fill="#C8F902"/>
  </svg>
);

// Compact category chip — visually distinct from the queue's CategoryBadge
const BriefChip = ({ cat }) => {
  const c = window.DM_CATEGORIES[cat];
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
      padding: '2px 7px', borderRadius: 4,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      whiteSpace: 'nowrap',
    }}>{c.label}</span>
  );
};

// ─────────── SLACK PREVIEW CARD ───────────
const SlackPreview = ({ width }) => {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 12, overflow: 'hidden',
      boxShadow: '0 30px 60px rgba(10,20,16,0.45), 0 0 0 1px rgba(58,128,82,0.40)',
      width: width || '100%',
      fontFamily: '-apple-system, "Segoe UI", "Helvetica Neue", sans-serif',
      color: '#1D1C1D',
    }}>
      {/* Slack chrome */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 16px',
        borderBottom: '1px solid #E8E8E8',
        background: '#F8F8F8',
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ width: 11, height: 11, borderRadius: 9999, background: '#FF5F57' }}/>
          <span style={{ width: 11, height: 11, borderRadius: 9999, background: '#FEBC2E' }}/>
          <span style={{ width: 11, height: 11, borderRadius: 9999, background: '#28C840' }}/>
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 12, color: '#616061', fontWeight: 600 }}>
          Triage Agent · DriveX workspace
        </div>
        <div style={{ width: 38 }}/>
      </div>

      {/* Channel header */}
      <div style={{
        padding: '10px 18px',
        borderBottom: '1px solid #E8E8E8',
        display: 'flex', alignItems: 'center', gap: 10,
        fontSize: 14, color: '#1D1C1D',
        whiteSpace: 'nowrap',
      }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 4l5 4 5-4" stroke="#616061" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="2" y="3" width="12" height="10" rx="2" stroke="#616061" strokeWidth="1.5"/>
        </svg>
        <span style={{ fontWeight: 700 }}>Triage Agent</span>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.10em',
          color: '#FFFFFF', background: '#616061',
          padding: '1px 5px', borderRadius: 3,
        }}>APP</span>
      </div>

      {/* Message body */}
      <div style={{ padding: '18px 18px 14px' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <AgentMarkSVG size={36}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4, flexWrap: 'wrap',
              whiteSpace: 'nowrap',
            }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Triage Agent</span>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.10em',
                color: '#FFFFFF', background: '#616061',
                padding: '1px 5px', borderRadius: 3,
              }}>APP</span>
              <span style={{ fontSize: 12, color: '#616061' }}>7:00 AM</span>
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.5, color: '#1D1C1D', marginBottom: 6 }}>
              Good morning, Jamie. Here's what needs you today.
            </div>
            <div style={{ fontSize: 13, color: '#616061', marginBottom: 14 }}>
              <strong style={{ color: '#1D1C1D', fontVariantNumeric: 'tabular-nums' }}>3 threads</strong> need a human eye · <strong style={{ color: '#1D1C1D', fontVariantNumeric: 'tabular-nums' }}>5 others</strong> drafted, ready to send · <strong style={{ color: '#1D1C1D', fontVariantNumeric: 'tabular-nums' }}>2 noise</strong> auto-archived
            </div>

            {/* Slack-style "blocks" — each item is a card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {BRIEF_ITEMS.map((it, i) => (
                <div key={it.id} style={{
                  borderLeft: it.priority === 'high'
                    ? '3px solid #1E5631' : '3px solid #E8E8E8',
                  background: '#F8F8F8',
                  borderRadius: '0 6px 6px 0',
                  padding: '10px 14px',
                  display: 'flex', flexDirection: 'column', gap: 4,
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-num)', fontVariantNumeric: 'tabular-nums',
                      fontSize: 11, color: '#616061', fontWeight: 700,
                    }}>{i + 1}.</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1264A3', whiteSpace: 'nowrap' }}>
                      {it.sender}
                    </span>
                    <BriefChip cat={it.cat}/>
                    {it.priority === 'high' && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: '0.10em',
                        color: '#FFFFFF', background: '#E01E5A',
                        padding: '1px 6px', borderRadius: 3,
                      }}>HIGH&nbsp;PRIORITY</span>
                    )}
                  </div>
                  <div style={{ fontSize: 14, color: '#1D1C1D', lineHeight: 1.45 }}>
                    {it.line}
                  </div>
                </div>
              ))}
            </div>

            {/* Slack action button row */}
            <div style={{
              marginTop: 14, paddingTop: 12,
              borderTop: '1px solid #E8E8E8',
              display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
            }}>
              <button style={{
                background: '#D9E879',
                color: '#0A1410', border: '1px solid #B8C95F',
                fontFamily: '-apple-system, "Segoe UI", "Helvetica Neue", sans-serif',
                fontSize: 13, fontWeight: 700,
                padding: '8px 16px', borderRadius: 4, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                Open Queue (3 waiting)
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button style={{
                background: '#FFFFFF',
                color: '#1D1C1D', border: '1px solid #DDDDDD',
                fontFamily: '-apple-system, "Segoe UI", "Helvetica Neue", sans-serif',
                fontSize: 13, fontWeight: 600,
                padding: '8px 14px', borderRadius: 4, cursor: 'pointer',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>Skip today</button>
              <span style={{ flex: 1 }}/>
              <span style={{ fontSize: 11, color: '#9B9A9B', display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                  <path d="M8 4v4l2.5 2.5" stroke="#9B9A9B" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="8" cy="8" r="6.5" stroke="#9B9A9B" strokeWidth="1.5"/>
                </svg>
                Auto-clears at 9:00 AM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Slack input footer */}
      <div style={{
        padding: '10px 18px 14px',
        borderTop: '1px solid #E8E8E8',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          flex: 1, height: 36, borderRadius: 6,
          border: '1px solid #DDDDDD',
          padding: '0 12px',
          display: 'flex', alignItems: 'center',
          fontSize: 13, color: '#9B9A9B',
        }}>Reply…</div>
      </div>
    </div>
  );
};

// ─────────── EMAIL PREVIEW CARD ───────────
const EmailPreview = ({ width }) => {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 12, overflow: 'hidden',
      boxShadow: '0 30px 60px rgba(10,20,16,0.45), 0 0 0 1px rgba(58,128,82,0.40)',
      width: width || '100%',
      fontFamily: '-apple-system, "Segoe UI", "Helvetica Neue", sans-serif',
      color: '#202124',
    }}>
      {/* Mail client chrome */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 16px',
        borderBottom: '1px solid #E8E8E8',
        background: '#F6F8FC',
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ width: 11, height: 11, borderRadius: 9999, background: '#FF5F57' }}/>
          <span style={{ width: 11, height: 11, borderRadius: 9999, background: '#FEBC2E' }}/>
          <span style={{ width: 11, height: 11, borderRadius: 9999, background: '#28C840' }}/>
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 12, color: '#5F6368', fontWeight: 600 }}>
          Inbox · jamie@drivex.com
        </div>
        <div style={{ width: 38 }}/>
      </div>

      {/* Email metadata */}
      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #E8E8E8' }}>
        <div style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 22, fontWeight: 400, color: '#202124',
          letterSpacing: '-0.01em', marginBottom: 14, lineHeight: 1.25,
        }}>
          Triage Brief · Tuesday, April 28
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <AgentMarkSVG size={36}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 8,
              fontSize: 13, marginBottom: 3, minWidth: 0,
            }}>
              <span style={{ fontWeight: 700, color: '#202124', flexShrink: 0 }}>AI Ops</span>
              <span style={{ color: '#5F6368', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>&lt;triage@yourdomain.com&gt;</span>
              <span style={{ color: '#5F6368', fontSize: 12, flexShrink: 0,
                fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>7:00 AM (just now)</span>
            </div>
            <div style={{ fontSize: 13, color: '#5F6368', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              to <span style={{ color: '#202124' }}>jamie@drivex.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Email body */}
      <div style={{ padding: '28px 32px 20px', fontSize: 15, lineHeight: 1.6, color: '#202124' }}>
        <p style={{ margin: '0 0 6px', fontSize: 16 }}>Good morning, Jamie.</p>
        <p style={{ margin: '0 0 22px', color: '#5F6368' }}>
          Here's what needs you today.
        </p>

        {/* Three briefing rows — generous typography */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0,
          borderTop: '1px solid #E8E8E8' }}>
          {BRIEF_ITEMS.map((it, i) => (
            <div key={it.id} style={{
              borderBottom: '1px solid #E8E8E8',
              padding: '18px 0',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
              }}>
                <span style={{
                  fontFamily: 'var(--font-num)', fontVariantNumeric: 'tabular-nums',
                  fontSize: 12, color: '#5F6368', fontWeight: 700,
                  width: 22, flexShrink: 0,
                }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: '#202124', whiteSpace: 'nowrap' }}>
                  {it.sender}
                </span>
                <BriefChip cat={it.cat}/>
                {it.priority === 'high' && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.10em',
                    color: '#B71C1C', background: 'rgba(183,28,28,0.08)',
                    padding: '2px 6px', borderRadius: 3, border: '1px solid rgba(183,28,28,0.20)',
                  }}>HIGH&nbsp;PRIORITY</span>
                )}
              </div>
              <div style={{ fontSize: 15, color: '#202124', lineHeight: 1.5,
                paddingLeft: 32 }}>
                {it.line}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 28, padding: '20px 0 4px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <a href="#" style={{
            background: '#D9E879', color: '#0A1410',
            border: '1px solid #B8C95F',
            fontFamily: '-apple-system, "Segoe UI", "Helvetica Neue", sans-serif',
            fontSize: 14, fontWeight: 700,
            padding: '12px 28px', borderRadius: 9999,
            textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            boxShadow: '0 4px 12px rgba(217,232,121,0.35)',
            whiteSpace: 'nowrap',
          }}>
            Open Queue (3 waiting)
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        <p style={{ margin: '24px 0 0', textAlign: 'center', fontSize: 12, color: '#9AA0A6' }}>
          Brief composed in <span style={{ fontVariantNumeric: 'tabular-nums', color: '#5F6368' }}>1.4s</span> · Delivered <span style={{ fontVariantNumeric: 'tabular-nums', color: '#5F6368' }}>7:00 ET</span>
        </p>
      </div>

      {/* Email footer */}
      <div style={{
        padding: '14px 32px 18px',
        borderTop: '1px solid #E8E8E8',
        background: '#FAFAFA',
        fontSize: 11, color: '#9AA0A6', lineHeight: 1.5,
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      }}>
        <AgentMarkSVG size={18}/>
        <span>You're getting this because you're enrolled in Triage.</span>
        <span style={{ flex: 1 }}/>
        <a href="#" style={{ color: '#5F6368', textDecoration: 'underline' }}>Manage settings</a>
        <span style={{ color: '#DADCE0' }}>·</span>
        <a href="#" style={{ color: '#5F6368', textDecoration: 'underline' }}>Unsubscribe</a>
      </div>
    </div>
  );
};

// Meta-info strip beneath each preview
const PreviewMeta = ({ icon, channel, delivered, next }) => (
  <div style={{
    marginTop: 14,
    display: 'flex', alignItems: 'center', gap: 10,
    fontSize: 11, color: 'var(--muted)',
    fontVariantNumeric: 'tabular-nums',
  }}>
    <i data-lucide={icon} style={{ width: 12, height: 12, color: 'var(--lime)' }}></i>
    <span style={{ fontWeight: 700, letterSpacing: '0.12em', color: 'var(--lime)',
      textTransform: 'uppercase' }}>{channel}</span>
    <span style={{ color: 'rgba(244,241,232,0.20)' }}>·</span>
    <span>Delivered {delivered}</span>
    <span style={{ color: 'rgba(244,241,232,0.20)' }}>·</span>
    <span>Next brief at {next}</span>
  </div>
);

window.SlackPreview = SlackPreview;
window.EmailPreview = EmailPreview;
window.PreviewMeta = PreviewMeta;
window.AgentMarkSVG = AgentMarkSVG;
