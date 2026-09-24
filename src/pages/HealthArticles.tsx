import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { articles } from '../data/articles';

const allCategories = ['All', ...Array.from(new Set(articles.map(a => a.category)))];

export default function HealthArticles() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = articles.filter(a => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchSearch = !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--green-50), white)', borderBottom: '1px solid var(--border)', padding: '60px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ marginBottom: '16px' }}>Health Knowledge</div>
          <h1 className="heading-lg" style={{ marginBottom: '12px' }}>Health Articles & Tips</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 520, margin: '0 auto 32px' }}>
            Expert health information and tips from our licensed pharmacists to help you make informed healthcare decisions.
          </p>
          {/* Search */}
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <div className="search-bar">
              <div className="search-bar-icon"><Search size={18} /></div>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles..."
                aria-label="Search articles"
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ padding: '0 12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem' }}>×</button>
              )}
              <button className="search-bar-btn">
                <Search size={16} /> Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container section">
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '36px', justifyContent: 'center' }}>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                border: `2px solid ${activeCategory === cat ? 'var(--primary)' : 'var(--border)'}`,
                background: activeCategory === cat ? 'var(--primary)' : 'white',
                color: activeCategory === cat ? 'white' : 'var(--gray-700)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📖</div>
            <div className="empty-title">No articles found</div>
            <div className="empty-desc">Try a different search term or category.</div>
            <button className="btn btn-primary" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>
              Showing {filtered.length} article{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className="grid-3">
              {filtered.map(article => (
                <Link key={article.id} to={`/articles/${article.id}`} style={{ textDecoration: 'none' }}>
                  <div className="article-card">
                    <div style={{ height: 200, overflow: 'hidden' }}>
                      <img src={article.image} alt={article.title} className="article-img" />
                    </div>
                    <div className="article-body">
                      <div className="article-category">{article.category}</div>
                      <h2 className="article-title">{article.title}</h2>
                      <p className="article-excerpt">{article.excerpt}</p>
                      <div className="article-meta">
                        <span>✍️ {article.author}</span>
                        <span>·</span>
                        <span>{new Date(article.date).toLocaleDateString('en-NP', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>·</span>
                        <span>⏱ {article.readTime}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                        {article.tags.slice(0, 3).map(tag => (
                          <span key={tag} style={{ fontSize: '0.72rem', padding: '2px 8px', background: 'var(--green-50)', color: 'var(--green-700)', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        Read Full Article <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
