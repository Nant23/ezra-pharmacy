import { useEffect, useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getContactMessages, updateContactMessageStatus, type ContactMessage } from '../../services/api';

const messageStatuses: ContactMessage['status'][] = ['new', 'read', 'resolved'];

export default function AdminMessages() {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) return;
    let isActive = true;
    const loadMessages = async () => {
      try {
        const result = await getContactMessages();
        if (isActive) setMessages(result);
      } catch (error) {
        if (isActive) showToast(error instanceof Error ? error.message : 'Could not load contact messages.', 'error');
      } finally {
        if (isActive) setLoading(false);
      }
    };

    void loadMessages();
    const intervalId = window.setInterval(() => void loadMessages(), 30000);
    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [user?.id, isAdmin, showToast]);

  if (!user || !isAdmin) return null;

  const setStatus = async (message: ContactMessage, status: ContactMessage['status']) => {
    const success = await updateContactMessageStatus(message.id, status);
    if (!success) {
      showToast('Could not update message status.', 'error');
      return;
    }
    setMessages(current => current.map(item => item.id === message.id ? { ...item, status } : item));
    setSelectedMessage(current => current?.id === message.id ? { ...current, status } : current);
    showToast('Message status updated.', 'success');
  };

  const openMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === 'new') await setStatus(message, 'read');
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>Contact Messages</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
            {loading ? 'Loading customer messages...' : `${messages.length} message${messages.length === 1 ? '' : 's'} · ${messages.filter(message => message.status === 'new').length} new`}
          </p>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><LoadingSpinner /></div>
          ) : messages.length ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead><tr><th>Received</th><th>Customer</th><th>Subject</th><th>Phone</th><th>Status</th><th>Message</th></tr></thead>
                <tbody>
                  {messages.map(message => (
                    <tr key={message.id}>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>{new Date(message.createdAt).toLocaleString('en-NP')}</td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{message.name}</div>
                        <a href={`mailto:${message.email}`} style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{message.email}</a>
                      </td>
                      <td style={{ fontWeight: 600 }}>{message.subject}</td>
                      <td><a href={`tel:${message.phone}`} style={{ color: 'var(--gray-700)' }}>{message.phone}</a></td>
                      <td>
                        <select
                          className="form-input"
                          aria-label={`Status for ${message.subject}`}
                          value={message.status}
                          onChange={event => void setStatus(message, event.target.value as ContactMessage['status'])}
                          style={{ textTransform: 'capitalize', minWidth: 110 }}
                        >
                          {messageStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </td>
                      <td>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => void openMessage(message)}>View Message</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 40 }}>
              <div className="empty-icon"><Mail size={42} strokeWidth={1.3} /></div>
              <div className="empty-title">No customer messages yet</div>
            </div>
          )}
        </div>

        <Modal
          open={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          title={selectedMessage?.subject || 'Customer message'}
          footer={selectedMessage && (
            <>
              <a className="btn btn-secondary" href={`tel:${selectedMessage.phone}`}><Phone size={15} /> Call</a>
              <a className="btn btn-primary" href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject}`)}`}><Mail size={15} /> Reply by Email</a>
            </>
          )}
        >
          {selectedMessage && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 20 }}>
                <div><div className="form-label">Customer</div><div style={{ fontWeight: 600 }}>{selectedMessage.name}</div></div>
                <div><div className="form-label">Email</div><div>{selectedMessage.email}</div></div>
                <div><div className="form-label">Phone</div><div>{selectedMessage.phone}</div></div>
                <div><div className="form-label">Received</div><div>{new Date(selectedMessage.createdAt).toLocaleString('en-NP')}</div></div>
              </div>
              <div className="form-label">Message</div>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'var(--gray-800)' }}>{selectedMessage.message}</p>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}
