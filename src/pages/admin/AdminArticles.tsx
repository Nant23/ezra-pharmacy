import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Camera, ImagePlus, X, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { addArticle, deleteArticle, getAdminArticles, updateArticle } from '../../services/api';
import type { Article } from '../../types';

const emptyDraft = {
  title: '',
  excerpt: '',
  content: '',
  category: '',
  author: '',
  image: '',
  tags: ''
};

export default function AdminArticles() {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!draft.author && user?.name) setDraft(current => ({ ...current, author: user.name }));
  }, [draft.author, user?.name]);

  useEffect(() => {
    let isActive = true;
    getAdminArticles().then(data => {
      if (isActive) {
        setArticles(data);
        setLoading(false);
      }
    }).catch(error => {
      if (isActive) {
        setArticles([]);
        setLoading(false);
        showToast(error instanceof Error ? error.message : 'Could not load published articles.', 'error');
      }
    });
    return () => { isActive = false; };
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const handleImageSelection = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Choose an image file.', 'error');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showToast('Choose an image smaller than 15 MB.', 'error');
      return;
    }
    setImageFile(file);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.excerpt.trim() || !draft.content.trim() || !draft.category.trim() || !draft.author.trim()) {
      showToast('Complete the title, summary, article, category, and author fields.', 'error');
      return;
    }
    if (!imageFile && !draft.image.trim()) {
      showToast('Add a photo or provide an image URL.', 'error');
      return;
    }

    const wordCount = draft.content.trim().split(/\s+/).length;
    const article: Omit<Article, 'id'> = {
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim(),
      content: draft.content.trim(),
      category: draft.category.trim(),
      author: draft.author.trim(),
      image: draft.image.trim(),
      date: editingArticle?.date || new Date().toISOString().slice(0, 10),
      readTime: `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
      tags: draft.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    setSubmitting(true);
    const result = editingArticle
      ? await updateArticle(editingArticle.id, article, imageFile || undefined)
      : await addArticle(article, imageFile || undefined);
    setSubmitting(false);

    if (!result.success) {
      showToast(result.error || 'Could not publish the health tip.', 'error');
      return;
    }

    showToast(editingArticle ? 'Health tip updated.' : 'Health tip published.', 'success');
    setEditingArticle(null);
    setDraft({ ...emptyDraft, author: user?.name || 'Ezra Pharmacy Admin' });
    setImageFile(null);
    try {
      setArticles(await getAdminArticles());
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not refresh published articles.', 'error');
    }
  };

  const startEditing = (article: Article) => {
    setEditingArticle(article);
    setDraft({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      author: article.author,
      image: article.image,
      tags: article.tags.join(', ')
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingArticle(null);
    setDraft({ ...emptyDraft, author: user?.name || 'Ezra Pharmacy Admin' });
    setImageFile(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await deleteArticle(deleteTarget.id);
    if (!result.success) {
      showToast(result.error || 'Could not delete the health tip.', 'error');
      setDeleteTarget(null);
      return;
    }

    setArticles(current => current.filter(article => article.id !== deleteTarget.id));
    if (editingArticle?.id === deleteTarget.id) cancelEditing();
    showToast('Health tip deleted.', 'success');
    setDeleteTarget(null);
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>Health Tips</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>Write and publish articles for customers.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 28 }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 20, color: 'var(--gray-900)' }}>{editingArticle ? 'Edit health tip' : 'Write a health tip'}</h2>

          <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="article-title">Title *</label>
              <input id="article-title" className="form-input" value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="article-author">Author / Byline *</label>
              <input id="article-author" className="form-input" value={draft.author} onChange={event => setDraft({ ...draft, author: event.target.value })} required />
            </div>
          </div>

          <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="article-category">Category *</label>
              <input id="article-category" className="form-input" value={draft.category} onChange={event => setDraft({ ...draft, category: event.target.value })} placeholder="e.g. Nutrition, Heart Health" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="article-tags">Tags</label>
              <input id="article-tags" className="form-input" value={draft.tags} onChange={event => setDraft({ ...draft, tags: event.target.value })} placeholder="Separate tags with commas" />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label" htmlFor="article-excerpt">Summary *</label>
            <textarea id="article-excerpt" className="form-input" rows={2} value={draft.excerpt} onChange={event => setDraft({ ...draft, excerpt: event.target.value })} required />
          </div>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label" htmlFor="article-content">Article *</label>
            <textarea id="article-content" className="form-input" rows={10} value={draft.content} onChange={event => setDraft({ ...draft, content: event.target.value })} placeholder="Write the health tip. Separate paragraphs with blank lines; use **bold text** for emphasis." required />
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <div className="form-label">Cover image *</div>
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" aria-label="Take an article photo" style={{ display: 'none' }} onChange={event => { handleImageSelection(event.target.files?.[0]); event.target.value = ''; }} />
            <input ref={imageInputRef} type="file" accept="image/*" aria-label="Choose an article image" style={{ display: 'none' }} onChange={event => { handleImageSelection(event.target.files?.[0]); event.target.value = ''; }} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => cameraInputRef.current?.click()}><Camera size={15} /> Take Photo</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => imageInputRef.current?.click()}><ImagePlus size={15} /> Choose Image</button>
            </div>
            {(imagePreview || draft.image) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                <img src={imagePreview || draft.image} alt="Article cover preview" style={{ width: 96, height: 64, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
                {imageFile && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{imageFile.name}</span>}
                {imageFile && <button type="button" className="btn btn-ghost btn-sm" onClick={() => setImageFile(null)} aria-label="Remove selected article image"><X size={15} /></button>}
              </div>
            )}
            <label className="form-label" htmlFor="article-image-url" style={{ marginTop: 12 }}>Or use an image URL</label>
            <input id="article-image-url" type="url" className="form-input" value={draft.image} onChange={event => { setImageFile(null); setDraft({ ...draft, image: event.target.value }); }} placeholder="https://example.com/health-tip.jpg" required={!imageFile} />
            {imageFile && <div style={{ marginTop: 5, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>The selected photo will be used instead of the URL.</div>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Read time is estimated from the article length.</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {editingArticle && <button type="button" className="btn btn-ghost" onClick={cancelEditing}>Cancel</button>}
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : editingArticle ? 'Save Changes' : 'Publish Health Tip'}</button>
            </div>
          </div>
        </form>

        <section>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 12, color: 'var(--gray-900)' }}>Published Articles</h2>
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><LoadingSpinner /></div>
            ) : articles.length ? articles.map(article => (
              <div key={article.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{article.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 3 }}>{article.category} · {article.author} · {article.date}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <a className="btn btn-ghost btn-sm" href={`/articles/${article.id}`} target="_blank" rel="noreferrer" aria-label={`View ${article.title}`} title="View article"><ExternalLink size={15} /></a>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => startEditing(article)} aria-label={`Edit ${article.title}`} title="Edit article"><Pencil size={15} /></button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(article)} aria-label={`Delete ${article.title}`} title="Delete article" style={{ color: 'var(--red-600)' }}><Trash2 size={15} /></button>
                </div>
              </div>
            )) : <div className="empty-state" style={{ padding: 32 }}><div className="empty-title">No published articles</div></div>}
          </div>
        </section>
        <Modal
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete health tip?"
          footer={(
            <>
              <button type="button" className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete Article</button>
            </>
          )}
        >
          <p style={{ color: 'var(--gray-700)' }}>
            This will permanently delete <strong>{deleteTarget?.title}</strong> from the published health tips.
          </p>
        </Modal>
      </main>
    </div>
  );
}
