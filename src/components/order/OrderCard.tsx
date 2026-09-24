import { Package, ChevronRight } from 'lucide-react';
import type { Order } from '../../types';

interface OrderCardProps {
  order: Order;
}

const statusLabel: Record<Order['status'], string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

export default function OrderCard({ order }: OrderCardProps) {
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  const date = new Date(order.createdAt).toLocaleDateString('en-NP', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className="order-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Package size={16} color="var(--primary)" />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-900)' }}>{order.id}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{date} · {itemCount} item{itemCount > 1 ? 's' : ''}</div>
        </div>
        <span className={`order-status status-${order.status}`}>{statusLabel[order.status]}</span>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {order.items.slice(0, 3).map((item, idx) => (
          <img
            key={idx}
            src={item.medicine.image}
            alt={item.medicine.name}
            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
          />
        ))}
        {order.items.length > 3 && (
          <div style={{ width: 50, height: 50, background: 'var(--gray-100)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-600)' }}>
            +{order.items.length - 3}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Total Amount</div>
          <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.05rem' }}>Rs. {order.total + order.deliveryFee}</div>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', background: 'var(--green-50)', border: '1px solid var(--green-200)', borderRadius: 'var(--radius-lg)', padding: '6px 14px', cursor: 'pointer', transition: 'var(--transition)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--green-100)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--green-50)')}>
          View Details <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
