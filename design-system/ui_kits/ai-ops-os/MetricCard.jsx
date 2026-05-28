// MetricCard.jsx
const MetricCard = ({ label, value, sub, tone = 'default' }) => {
  const isLight = tone === 'paper';
  const isLive = tone === 'live';
  return (
    <div style={{
      flex: 1,
      background: isLight ? 'var(--paper)' : 'var(--surface)',
      color: isLight ? 'var(--ink)' : 'var(--paper-text)',
      borderRadius: 14, padding: 18,
      boxShadow: isLive
        ? '0 1px 0 rgba(10,20,16,0.20), 0 0 0 1px rgba(200,249,2,0.45), 0 0 24px rgba(200,249,2,0.20)'
        : '0 1px 0 rgba(10,20,16,0.20), 0 0 0 1px rgba(58,128,82,0.35)',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: isLive ? 'var(--volt)' : (isLight ? 'var(--muted-light)' : 'var(--muted)'),
        marginBottom: 8,
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-serif)', fontSize: 40, lineHeight: 1,
        letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums lining-nums',
        color: isLive ? 'var(--volt)' : 'inherit',
      }}>{value}</div>
      <div style={{ fontSize: 13, color: isLight ? 'var(--muted-light)' : 'var(--muted)', marginTop: 6 }}>{sub}</div>
    </div>
  );
};
window.MetricCard = MetricCard;
