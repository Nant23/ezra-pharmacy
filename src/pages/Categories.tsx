import { useNavigate } from 'react-router-dom';
import { categories } from '../data/categories';

export default function Categories() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--green-50), white)', borderBottom: '1px solid var(--border)', padding: '60px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ marginBottom: '16px' }}>Browse by Category</div>
          <h1 className="heading-lg" style={{ marginBottom: '12px' }}>All Medicine Categories</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Find exactly what you need across {categories.length} specialized categories
          </p>
        </div>
      </div>

      <div className="container section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => navigate(`/medicines?category=${encodeURIComponent(cat.name)}`)}
              style={{ background: cat.color, borderRadius: 'var(--radius-xl)', padding: '28px', cursor: 'pointer', transition: 'var(--transition-slow)', border: '2px solid transparent', display: 'flex', gap: '16px', alignItems: 'center' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-200)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
              role="button"
              tabIndex={0}
              aria-label={`Browse ${cat.name}`}
            >
              <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.7)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
                {cat.icon}
              </div>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)', marginBottom: '4px' }}>{cat.name}</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '6px' }}>{cat.description}</p>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>{cat.count} products →</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
