import { useToast } from '../../context/ToastContext';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const icons = {
    success: <CheckCircle size={18} color="var(--green-600)" />,
    error: <AlertCircle size={18} color="var(--red-500)" />,
    warning: <AlertTriangle size={18} color="var(--amber-500)" />,
    info: <Info size={18} color="var(--blue-500)" />,
  };

  return (
    <div className="toast-container" role="alert" aria-live="polite">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-icon">{icons[toast.type]}</span>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => removeToast(toast.id)} aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
