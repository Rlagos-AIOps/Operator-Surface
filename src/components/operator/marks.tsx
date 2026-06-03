export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <rect width="32" height="32" rx="8" fill="var(--color-lime)" />
      <path d="M16 8.5 L23.5 22 H8.5 Z" fill="var(--color-ink)" />
    </svg>
  );
}
