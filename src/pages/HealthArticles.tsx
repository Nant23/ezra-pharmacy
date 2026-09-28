import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { getArticles } from '../services/api';
import type { Article } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function HealthArticles() {
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    getArticles().then(data => {
      setArticlesList(data);
      setLoading(false);
    });
  }, []);

  const allCategories = useMemo(() => {
    return ['All', ...Array.from(new Set(articlesList.map(a => a.category)))];
  }, [articlesList]);

  const filtered = useMemo(() => {
    return articlesList.filter(a => {
      const matchCat = activeCategory === 'All' || a.category === activeCategory;
      const matchSearch = !search ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [articlesList, activeCategory, search]);

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
                fontSize: '0.875rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: activeCategory === cat ? 'var(--primary)' : 'var(--gray-100)',
                color: activeCategory === cat ? 'white' : 'var(--gray-700)',
                transition: 'var(--transition)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <LoadingSpinner />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📖</div>
            <div className="empty-title">No articles found</div>
            <div className="empty-desc">Try searching for other topics or select "All" categories</div>
            <button className="btn btn-primary" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map(article => (
              <Link key={article.id} to={`/articles/${article.id}`} style={{ textDecoration: 'none' }}>
                <div className="article-card">
                  <div style={{ height: 200, overflow: 'hidden' }}>
                    <img src={article.image} alt={article.title} className="article-img" />
                  </div>
                  <div className="article-body">
                    <div className="article-category">{article.category}</div>
                    <h2 className="article-title" style={{ fontSize: '1.05rem', margin: '8px 0' }}>{article.title}</h2>
                    <p className="article-excerpt">{article.excerpt}</p>
                    <div className="article-meta">
                      <span>{article.date}</span>
                      <span>·</span>
                      <span>{article.readTime}</span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      Read More <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
