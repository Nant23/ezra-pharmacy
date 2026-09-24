export default function LoadingSpinner({ size = 40, text }: { size?: number; text?: string }) {
  return (
    <div className="loading-screen" style={{ flexDirection: 'column', gap: '16px' }}>
      <div
        className="spinner"
        style={{ width: size, height: size }}
        role="status"
        aria-label="Loading"
      />
      {text && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{text}</p>}
    </div>
  );
}
