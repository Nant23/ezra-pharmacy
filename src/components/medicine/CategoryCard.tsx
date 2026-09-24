import type { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  active?: boolean;
  onClick?: () => void;
}

export default function CategoryCard({ category, active, onClick }: CategoryCardProps) {
  return (
    <div
      className={`category-card ${active ? 'active' : ''}`}
      style={{ background: category.color }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}
    >
      <div className="category-icon" style={{ background: 'rgba(255,255,255,0.6)' }}>
        {category.icon}
      </div>
      <div className="category-name">{category.name}</div>
      <div className="category-count">{category.count} items</div>
    </div>
  );
}
