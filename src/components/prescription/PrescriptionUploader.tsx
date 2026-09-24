import { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function PrescriptionUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [dragging, setDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFile = (f: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(f.type)) {
      showToast('Please upload a JPG, PNG, WebP, or PDF file.', 'error');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      showToast('File size must be less than 10 MB.', 'error');
      return;
    }
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { showToast('Please upload a prescription file.', 'error'); return; }
    setSubmitted(true);
    showToast('Prescription submitted! Our pharmacist will review it shortly.', 'success');
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ width: 80, height: 80, background: 'var(--green-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--primary)' }}>
          <CheckCircle size={40} />
        </div>
        <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: 8 }}>Prescription Submitted!</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
          Thank you! Our licensed pharmacist will review your prescription within 2-4 hours and contact you to confirm your order.
        </p>
        <button className="btn btn-primary btn-lg" onClick={() => { setSubmitted(false); setFile(null); setNotes(''); }}>
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Info Banner */}
      <div style={{ background: 'var(--blue-50)', border: '1px solid var(--blue-100)', borderLeft: '4px solid var(--blue-500)', borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>Prescription medicines require pharmacist verification</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
            Please upload a clear, readable image or PDF of your prescription. Our pharmacist will review and verify it before processing your order. Do not share expired or altered prescriptions.
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className={`upload-zone ${dragging ? 'dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload prescription"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          style={{ display: 'none' }}
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
        />

        {file ? (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>
              {file.type === 'application/pdf' ? '📄' : '🖼️'}
            </div>
            <div style={{ fontWeight: 600, color: 'var(--gray-900)', marginBottom: 4 }}>{file.name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {(file.size / 1024).toFixed(0)} KB
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--red-600)', background: 'var(--red-50)', border: '1px solid var(--red-100)', borderRadius: 'var(--radius-md)', padding: '6px 14px', cursor: 'pointer' }}
            >
              <X size={14} /> Remove File
            </button>
          </div>
        ) : (
          <>
            <div className="upload-icon">
              <Upload size={28} />
            </div>
            <h4 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--gray-800)' }}>
              {dragging ? 'Drop your file here' : 'Upload Prescription'}
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 12 }}>
              Drag & drop or click to browse
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '6px 14px' }}>
              <FileText size={13} /> JPG, PNG, WebP, PDF · Max 10 MB
            </div>
          </>
        )}
      </div>

      {/* Notes */}
      <div className="form-group" style={{ marginTop: '20px' }}>
        <label className="form-label" htmlFor="prescription-notes">
          Additional Notes (Optional)
        </label>
        <textarea
          id="prescription-notes"
          className="form-input"
          rows={3}
          placeholder="Add any notes for the pharmacist, e.g., specific medicine requests, dosage queries..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          style={{ resize: 'vertical', minHeight: '80px' }}
        />
      </div>

      <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '20px' }}>
        <Upload size={18} /> Submit Prescription
      </button>
    </form>
  );
}
