import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, User, ChevronRight } from 'lucide-react';
import { articles } from '../data/articles';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const article = articles.find(a => a.id === id);
  const related = articles.filter(a => a.id !== id && a.category === article?.category).slice(0, 3);

  if (!article) {
    return (
      <div className="page-wrapper">
        <div className="container section" style={{ textAlign: 'center' }}>
          <div className="empty-icon">📖</div>
          <div className="empty-title">Article not found</div>
          <Link to="/articles" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Articles</Link>
        </div>
      </div>
    );
  }

  // Convert markdown-like content to basic HTML
  const renderContent = (content: string) => {
    return content.split('\n\n').map((para, i) => {
      if (para.startsWith('**') && para.endsWith('**')) {
        return <h3 key={i} style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--gray-900)', margin: '24px 0 12px' }}>{para.replace(/\*\*/g, '')}</h3>;
      }
      // Handle inline bold
      const parts = para.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} style={{ color: 'var(--gray-700)', lineHeight: 1.85, marginBottom: '16px', fontSize: '1rem' }}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j}>{part.replace(/\*\*/g, '')}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ padding: '32px 24px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', fontSize: '0.875rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
          <Link to="/articles" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontWeight: 600 }}>
            <ArrowLeft size={14} /> Articles
          </Link>
          <span>›</span>
          <span>{article.category}</span>
          <span>›</span>
          <span style={{ color: 'var(--gray-700)' }}>{article.title.substring(0, 40)}...</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '48px', alignItems: 'start' }}>
          {/* Main */}
          <article>
            {/* Category */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span className="badge badge-green">{article.category}</span>
              {article.tags.map(tag => (
                <span key={tag} style={{ fontSize: '0.72rem', padding: '2px 8px', background: 'var(--gray-100)', color: 'var(--gray-600)', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                  #{tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.2, marginBottom: '20px' }}>
              {article.title}
            </h1>

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 36, height: 36, background: 'var(--green-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <User size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--gray-900)' }}>{article.author}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Medical Expert</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Clock size={14} />
                {article.readTime}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Published {new Date(article.date).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            {/* Hero Image */}
            <img
              src={article.image}
              alt={article.title}
              style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 'var(--radius-2xl)', marginBottom: '36px', boxShadow: 'var(--shadow-lg)' }}
            />

            {/* Excerpt */}
            <div style={{ background: 'var(--green-50)', border: '1px solid var(--green-100)', borderLeft: '4px solid var(--primary)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', marginBottom: '32px' }}>
              <p style={{ color: 'var(--green-800)', fontWeight: 500, lineHeight: 1.7, fontSize: '1.05rem', fontStyle: 'italic' }}>
                {article.excerpt}
              </p>
            </div>

            {/* Content */}
            <div style={{ maxWidth: 720 }}>
              {renderContent(article.content)}
            </div>

            {/* Medical Disclaimer */}
            <div style={{ marginTop: '40px', background: 'var(--amber-50)', border: '1px solid var(--amber-100)', borderRadius: 'var(--radius-xl)', padding: '20px 24px' }}>
              <div style={{ fontWeight: 700, color: 'var(--amber-700)', marginBottom: '8px' }}>⚠️ Medical Disclaimer</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--amber-700)', lineHeight: 1.6 }}>
                This article is for informational purposes only and should not be used as a substitute for professional medical advice. Always consult a licensed healthcare provider for medical decisions.
              </p>
            </div>
          </article>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + 16px)' }}>
            {/* Related */}
            {related.length > 0 && (
              <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '20px', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '16px', color: 'var(--gray-900)' }}>Related Articles</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {related.map(rel => (
                    <Link key={rel.id} to={`/articles/${rel.id}`} style={{ display: 'flex', gap: '12px', textDecoration: 'none' }}>
                      <img src={rel.image} alt={rel.title} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 'var(--radius-lg)', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gray-900)', lineHeight: 1.3, marginBottom: '4px' }}>{rel.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{rel.readTime}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Pharmacy CTA */}
            <div style={{ background: 'linear-gradient(135deg, var(--green-600), var(--green-700))', borderRadius: 'var(--radius-xl)', padding: '24px', color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💊</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '8px' }}>Need Medicines?</div>
              <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '16px', lineHeight: 1.5 }}>
                Order genuine medicines from Ezra Pharmacy with same-day delivery.
              </p>
              <Link to="/medicines" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '10px 20px', background: 'white', color: 'var(--primary)', borderRadius: 'var(--radius-lg)', fontWeight: 700, fontSize: '0.875rem' }}>
                Shop Now <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
