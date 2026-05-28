// QueueRow.jsx — single thread row for the Approval Queue
const CategoryBadge = ({ cat }) => {
  const c = window.DM_CATEGORIES[cat];
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
      padding: '3px 8px', borderRadius: 4,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>{c.label}</span>
  );
};

const ConfidenceMeter = ({ value }) => {
  const pct = Math.round(value * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 48, height: 4, background: 'rgba(244,241,232,0.10)', borderRadius: 9999, overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', background: 'var(--lime)' }}/>
      </div>
      <span style={{ fontSize: 11, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{pct}</span>
    </div>
  );
};

// Mobile-first row — stacks vertically, swipeable footprint
const QueueRowMobile = ({ thread, onApprove, onReject, onOpen, status }) => {
  const isAuto = thread.cat === 'noise';
  const radius = thread.preview && thread.preview.length < 40
    ? '40px 12px 40px 12px' : '60px 15px 60px 15px';
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 14,
      padding: '14px 16px', marginBottom: 10,
      border: status === 'approved'
        ? '1px solid rgba(200,249,2,0.5)'
        : '1px solid var(--surface-edge)',
      boxShadow: status === 'approved'
        ? '0 0 0 4px rgba(200,249,2,0.12), 0 0 20px rgba(200,249,2,0.20)'
        : '0 1px 0 rgba(10,20,16,0.20)',
      transition: 'all 220ms cubic-bezier(0.2, 0.9, 0.2, 1)',
      transform: status === 'approved' ? 'translateX(8px)' : 'none',
      opacity: status === 'rejected' ? 0.4 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9999, background: 'var(--surface-2)', color: 'var(--paper)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-serif)', fontSize: 14, flexShrink: 0,
        }}>{thread.name[0]}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{thread.name}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{thread.role}</div>
        </div>
        <CategoryBadge cat={thread.cat}/>
      </div>

      {/* Inbound bubble (paper) */}
      <div style={{
        background: 'var(--paper)', color: 'var(--ink)',
        borderRadius: radius, padding: '10px 16px', fontSize: 13,
        marginBottom: 8, lineHeight: 1.45,
      }}>{thread.preview}</div>

      {/* Drafted reply or auto-archive note */}
      {!isAuto ? (
        <div style={{
          background: 'linear-gradient(135deg,#D9E879,#C8F902)',
          color: 'var(--ink)',
          borderRadius: '15px 60px 15px 60px',
          padding: '10px 16px', fontSize: 13, lineHeight: 1.45,
          marginBottom: 10, marginLeft: 24,
        }}>{thread.draft}</div>
      ) : (
        <div style={{
          border: '1.5px dotted var(--muted)', color: 'var(--muted)',
          borderRadius: '15px 60px 15px 60px',
          padding: '8px 16px', fontSize: 12, lineHeight: 1.4,
          marginBottom: 10, marginLeft: 24, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <i data-lucide="archive" style={{ width: 12, height: 12 }}></i>
          <span>{thread.draft}</span>
        </div>
      )}

      {/* Footer: time + confidence + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 11, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{thread.time}</span>
        <ConfidenceMeter value={thread.confidence}/>
        <div style={{ flex: 1 }}></div>
        {!isAuto && status !== 'approved' && (
          <>
            <button onClick={() => onReject(thread.id)} aria-label="Reject" style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'transparent', color: 'var(--muted)',
              border: '1px solid rgba(244,241,232,0.20)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><i data-lucide="x" style={{ width: 16, height: 16 }}></i></button>
            <button onClick={() => onOpen(thread.id)} aria-label="Trace" style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'transparent', color: 'var(--paper-text)',
              border: '1px solid rgba(244,241,232,0.20)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><i data-lucide="file-search" style={{ width: 16, height: 16 }}></i></button>
            <button onClick={() => onApprove(thread.id)} style={{
              height: 36, padding: '0 14px', borderRadius: 8,
              background: 'var(--lime)', color: 'var(--ink)', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <i data-lucide="send" style={{ width: 14, height: 14 }}></i>
              <span>Send</span>
            </button>
          </>
        )}
        {status === 'approved' && (
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--volt)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <i data-lucide="check" style={{ width: 14, height: 14 }}></i>
            <span>SENT</span>
          </span>
        )}
        {isAuto && (
          <span style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.04em' }}>Archived</span>
        )}
      </div>
    </div>
  );
};

// Desktop row — single line, denser
const QueueRowDesktop = ({ thread, onApprove, onReject, onOpen, status, selected, onSelect }) => {
  const isAuto = thread.cat === 'noise';
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '24px 220px 110px 1fr 80px 200px',
      gap: 16, alignItems: 'center',
      padding: '16px 20px',
      borderBottom: '1px solid rgba(244,241,232,0.06)',
      background: selected ? 'rgba(217,232,121,0.06)' : 'transparent',
      borderLeft: status === 'approved' ? '2px solid var(--volt)' : '2px solid transparent',
      opacity: status === 'rejected' ? 0.4 : 1,
      transition: 'all 180ms cubic-bezier(0.2, 0.9, 0.2, 1)',
    }}>
      <input type="checkbox" checked={!!selected} onChange={() => onSelect(thread.id)}
        style={{ accentColor: '#D9E879', width: 16, height: 16, cursor: 'pointer' }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 9999, background: 'var(--surface-2)', color: 'var(--paper)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-serif)', fontSize: 13, flexShrink: 0,
        }}>{thread.name[0]}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{thread.name}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{thread.role}</div>
        </div>
      </div>
      <CategoryBadge cat={thread.cat}/>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--paper-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{thread.preview}</div>
        <div style={{ fontSize: 12, color: isAuto ? 'var(--muted)' : 'var(--lime)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2,
          fontStyle: isAuto ? 'italic' : 'normal',
        }}>
          <span style={{ marginRight: 6 }}>↳</span>{thread.draft}
        </div>
      </div>
      <ConfidenceMeter value={thread.confidence}/>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums', marginRight: 4 }}>{thread.time}</span>
        {!isAuto && status !== 'approved' && (
          <>
            <button onClick={() => onReject(thread.id)} aria-label="Reject" style={{
              width: 30, height: 30, borderRadius: 6, background: 'transparent', color: 'var(--muted)',
              border: '1px solid rgba(244,241,232,0.16)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><i data-lucide="x" style={{ width: 14, height: 14 }}></i></button>
            <button onClick={() => onOpen(thread.id)} aria-label="Trace" style={{
              width: 30, height: 30, borderRadius: 6, background: 'transparent', color: 'var(--paper-text)',
              border: '1px solid rgba(244,241,232,0.16)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><i data-lucide="file-search" style={{ width: 14, height: 14 }}></i></button>
            <button onClick={() => onApprove(thread.id)} style={{
              height: 30, padding: '0 12px', borderRadius: 6,
              background: 'var(--lime)', color: 'var(--ink)', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <i data-lucide="send" style={{ width: 12, height: 12 }}></i>
              <span>Send</span>
            </button>
          </>
        )}
        {status === 'approved' && (
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--volt)',
            display: 'flex', alignItems: 'center', gap: 5 }}>
            <i data-lucide="check" style={{ width: 13, height: 13 }}></i>SENT
          </span>
        )}
        {isAuto && (
          <span style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.04em' }}>Archived</span>
        )}
      </div>
    </div>
  );
};

window.QueueRowMobile = QueueRowMobile;
window.QueueRowDesktop = QueueRowDesktop;
window.CategoryBadge = CategoryBadge;
window.ConfidenceMeter = ConfidenceMeter;
