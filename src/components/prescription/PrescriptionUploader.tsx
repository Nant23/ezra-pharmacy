import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, X, CheckCircle, Loader2, Stethoscope, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { uploadPrescription } from '../../services/api';

interface PrescriptionUploaderProps {
  compact?: boolean;
  onSuccess?: (prescriptionId: string) => void;
}

export default function PrescriptionUploader({ compact = false, onSuccess }: PrescriptionUploaderProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [userName, setUserName] = useState(user?.name || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [doctorName, setDoctorName] = useState('');
  const [notes, setNotes] = useState('');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [prescriptionId, setPrescriptionId] = useState('');
  const [confirmedPhone, setConfirmedPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      if (!userName && user.name) setUserName(user.name);
      if (!userPhone && user.phone) setUserPhone(user.phone);
    }
  }, [user]);

  // Clean up object URLs to prevent leaks
  useEffect(() => {
    return () => {
      if (filePreview && filePreview.startsWith('blob:')) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const handleFile = (f: File) => {
    const isPdf = f.type === 'application/pdf' || f.type === 'application/x-pdf' || f.name.toLowerCase().endsWith('.pdf');
    const isImage = f.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(f.name);

    if (!isPdf && !isImage) {
      showToast('Please upload a JPG, PNG, WebP, or PDF file.', 'error');
      return;
    }
    if (f.size > 15 * 1024 * 1024) {
      showToast('File size must be less than 15 MB.', 'error');
      return;
    }
    setFile(f);
    if (isImage) {
      const previewUrl = URL.createObjectURL(f);
      setFilePreview(previewUrl);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleRemoveFile = () => {
    if (filePreview && filePreview.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      showToast('Please select or drop a prescription file to upload.', 'error');
      return;
    }

    const finalName = (userName || user?.name || '').trim();
    const rawPhone = (userPhone || user?.phone || '').trim();
    const cleanedPhone = rawPhone.replace(/[\s\-\(\)]/g, '').replace(/^(\+?977)/, '');

    let hasError = false;

    if (!finalName) {
      setNameError('Full name is required.');
      hasError = true;
    } else {
      setNameError('');
    }

    // Phone number is strictly mandatory
    if (!cleanedPhone) {
      setPhoneError('Contact phone number is mandatory.');
      showToast('Phone number is mandatory. Please provide a contact number.', 'error');
      phoneInputRef.current?.focus();
      hasError = true;
    } else if (!/^(98|97)\d{8}$|^01\d{6,8}$|^\d{8,10}$/.test(cleanedPhone)) {
      setPhoneError('Please enter a valid Nepal phone number (e.g. 98XXXXXXXX or 01XXXXXXX).');
      showToast('Please enter a valid Nepal phone number (e.g. 9841XXXXXX).', 'error');
      phoneInputRef.current?.focus();
      hasError = true;
    } else {
      setPhoneError('');
    }

    if (hasError) return;

    setUploading(true);
    const res = await uploadPrescription(
      file,
      user?.id,
      finalName,
      cleanedPhone,
      notes.trim(),
      doctorName.trim()
    );
    setUploading(false);

    if (!res.success) {
      showToast(res.error || 'Failed to upload prescription. Please try again.', 'error');
      return;
    }

    const newId = res.prescriptionId || '';
    setPrescriptionId(newId);
    setConfirmedPhone(cleanedPhone);
    setSubmitted(true);
    showToast('Prescription uploaded successfully! It is now visible in the Admin Panel.', 'success');
    if (onSuccess) onSuccess(newId);
  };

  if (submitted) {
    return (
      <div style={{
        textAlign: 'center',
        padding: compact ? '32px 20px' : '48px 24px',
        background: 'white',
        borderRadius: 'var(--radius-2xl)',
        border: '1px solid var(--green-200)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{
          width: 72,
          height: 72,
          background: 'var(--green-100)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: 'var(--primary)'
        }}>
          <CheckCircle size={38} />
        </div>

        <span className="badge badge-green" style={{ marginBottom: 12, padding: '6px 14px', fontSize: '0.85rem' }}>
          ✓ Verified Transmission
        </span>

        <h3 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 8, color: 'var(--gray-900)' }}>
          Doctor's Prescription Submitted!
        </h3>

        {prescriptionId && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--green-50)',
            border: '1px solid var(--green-200)',
            borderRadius: 'var(--radius-lg)',
            padding: '8px 18px',
            marginBottom: 16
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>Rx Tracking ID:</span>
            <strong style={{ color: 'var(--primary)', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
              {prescriptionId}
            </strong>
          </div>
        )}

        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 460, margin: '0 auto 24px', lineHeight: 1.6, fontSize: '0.95rem' }}>
          Our licensed pharmacist is reviewing your doctor's prescription. We will contact you at{' '}
          <strong style={{ color: 'var(--gray-900)' }}>{confirmedPhone || userPhone || user?.phone}</strong> to verify the medicines, dosage, and arrange express delivery.
        </p>

        {doctorName && (
          <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: 20 }}>
            Prescribing Doctor: <strong>{doctorName}</strong>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              setSubmitted(false);
              setFile(null);
              setFilePreview(null);
              setNotes('');
              setDoctorName('');
              setPrescriptionId('');
            }}
          >
            Upload Another Prescription
          </button>

          {user ? (
            <Link to="/dashboard" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              View My Prescriptions <ExternalLink size={15} />
            </Link>
          ) : (
            <Link to="/medicines" className="btn btn-secondary">
              Browse Medicines
            </Link>
          )}

          {/* Quick Admin link for convenience */}
          <Link
            to="/admin/prescriptions"
            className="btn btn-ghost btn-sm"
            style={{ width: '100%', marginTop: 8, color: 'var(--text-muted)', fontSize: '0.78rem' }}
          >
            Switch to Pharmacist/Admin Review View →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--radius-2xl)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-md)',
      padding: compact ? '24px' : '32px',
      position: 'relative'
    }}>
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 24 }}>
        <div style={{
          width: 44,
          height: 44,
          background: 'var(--green-50)',
          border: '1px solid var(--green-200)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          flexShrink: 0
        }}>
          <Stethoscope size={22} />
        </div>
        <div>
          <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--gray-900)', marginBottom: 4 }}>
            Doctor's Prescription Upload
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Upload a clear photo or PDF of your doctor's prescription. Our Nepal Pharmacy Council registered pharmacists will review and verify before dispensing.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
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
          style={{
            border: dragging ? '2px dashed var(--primary)' : '2px dashed var(--green-300)',
            background: dragging ? 'var(--green-50)' : 'var(--gray-50)',
            borderRadius: 'var(--radius-xl)',
            padding: file ? '20px' : '32px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp,application/pdf"
            style={{ display: 'none' }}
            onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          />

          {file ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {filePreview ? (
                <div style={{
                  position: 'relative',
                  maxWidth: 240,
                  maxHeight: 180,
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  marginBottom: 12,
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <img
                    src={filePreview}
                    alt="Prescription preview"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', maxHeight: 180 }}
                  />
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'var(--blue-50)',
                  border: '1px solid var(--blue-200)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px 24px',
                  marginBottom: 12
                }}>
                  <span style={{ fontSize: '3rem', marginBottom: 4 }}>📄</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue-700)' }}>
                    PDF Prescription Document
                  </span>
                </div>
              )}

              <div style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '0.95rem', marginBottom: 2 }}>
                {file.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                {(file.size / 1024).toFixed(0)} KB · Ready to transmit
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.82rem',
                  color: 'var(--red-600)',
                  background: 'var(--red-50)',
                  border: '1px solid var(--red-100)',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                <X size={14} /> Remove / Change File
              </button>
            </div>
          ) : (
            <>
              <div className="upload-icon" style={{
                width: 52,
                height: 52,
                background: 'var(--green-100)',
                color: 'var(--primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <Upload size={24} />
              </div>
              <h4 style={{ fontWeight: 700, marginBottom: 6, color: 'var(--gray-800)', fontSize: '1rem' }}>
                {dragging ? 'Drop prescription file here' : 'Drag & drop your prescription, or browse'}
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 12 }}>
                Please ensure doctor's name, patient name, and medicines are clear & readable
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '5px 12px' }}>
                <FileText size={13} /> Supports JPG, PNG, WebP, PDF · Max 10 MB
              </div>
            </>
          )}
        </div>

        {/* Doctor Information & Patient Details */}
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="presc-doctor">
                Doctor's Name / Hospital <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
              </label>
              <input
                id="presc-doctor"
                type="text"
                className="form-input"
                placeholder="e.g. Dr. Karki, Bir Hospital / Norvic"
                value={doctorName}
                onChange={e => setDoctorName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="presc-phone" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  Contact Phone Number <strong style={{ color: 'var(--red-600)', fontSize: '0.85rem' }}>* (Mandatory)</strong>
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Nepal Mobile / Landline</span>
              </label>
              <input
                ref={phoneInputRef}
                id="presc-phone"
                type="tel"
                className="form-input"
                placeholder="e.g. 9841XXXXXX or 014XXXXXX (Required)"
                value={userPhone}
                onChange={e => {
                  setUserPhone(e.target.value);
                  if (phoneError) setPhoneError('');
                }}
                style={phoneError ? { borderColor: 'var(--red-500)', background: 'var(--red-50)' } : {}}
                required
              />
              {phoneError ? (
                <div style={{ color: 'var(--red-600)', fontSize: '0.8rem', marginTop: 4, fontWeight: 600 }}>
                  ⚠️ {phoneError}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 3 }}>
                  Pharmacist will call this number to verify medications and confirm delivery.
                </div>
              )}
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="presc-name">
                Patient / Customer Full Name <span style={{ color: 'var(--red-600)' }}>*</span>
              </label>
              <input
                id="presc-name"
                type="text"
                className="form-input"
                placeholder="e.g. Aarav Sharma"
                value={userName}
                onChange={e => {
                  setUserName(e.target.value);
                  if (nameError) setNameError('');
                }}
                style={nameError ? { borderColor: 'var(--red-500)', background: 'var(--red-50)' } : {}}
                required
              />
              {nameError && (
                <div style={{ color: 'var(--red-600)', fontSize: '0.8rem', marginTop: 4, fontWeight: 600 }}>
                  ⚠️ {nameError}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="presc-notes">
                Special Instructions for Pharmacist <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
              </label>
              <input
                id="presc-notes"
                type="text"
                className="form-input"
                placeholder="e.g. Need 1 month course, prefer syrup instead of tablets..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Trust Badges Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          marginTop: 20,
          padding: '12px 16px',
          background: 'var(--gray-50)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--gray-700)' }}>
            <ShieldCheck size={16} color="var(--primary)" />
            <span>100% Confidential & Secure</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--gray-700)' }}>
            <Clock size={16} color="var(--primary)" />
            <span>Verified within 2-4 Hours</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--gray-700)' }}>
            <Stethoscope size={16} color="var(--primary)" />
            <span>Reviewed by Licensed Pharmacists</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{
            width: '100%',
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-md)'
          }}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="spin" /> Transmitting Prescription to Pharmacist...
            </>
          ) : (
            <>
              <Upload size={20} /> Submit Doctor's Prescription
            </>
          )}
        </button>
      </form>
    </div>
  );
}
