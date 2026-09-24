import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

export default function Pagination({ current, total, onChange }: PaginationProps) {
  if (total <= 1) return null;

  const pages: (number | '...')[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
  }

  return (
    <div className="pagination" role="navigation" aria-label="Pagination">
      <button
        className="page-btn"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} style={{ padding: '0 4px', color: 'var(--text-muted)' }}>…</span>
        ) : (
          <button
            key={page}
            className={`page-btn ${current === page ? 'active' : ''}`}
            onClick={() => onChange(page as number)}
            aria-label={`Page ${page}`}
            aria-current={current === page ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        className="page-btn"
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
