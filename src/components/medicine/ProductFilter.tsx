import { RotateCcw } from 'lucide-react';
import type { FilterState } from '../../types';
import { categories } from '../../data/categories';

interface ProductFilterProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const defaultFilters: FilterState = {
  category: '',
  minPrice: 0,
  maxPrice: 2000,
  sortBy: 'default',
  availability: '',
  prescription: ''
};

export default function ProductFilter({ filters, onChange }: ProductFilterProps) {
  const update = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial });

  return (
    <div className="filter-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)' }}>Filters</h3>
        <button
          onClick={() => onChange(defaultFilters)}
          style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Sort */}
      <div className="filter-section">
        <div className="filter-title">Sort By</div>
        <select
          className="form-input"
          value={filters.sortBy}
          onChange={e => update({ sortBy: e.target.value })}
        >
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="name">Name A–Z</option>
          <option value="discount">Best Discount</option>
        </select>
      </div>

      {/* Categories */}
      <div className="filter-section">
        <div className="filter-title">Category</div>
        <label className="filter-option">
          <input
            type="radio"
            name="category"
            checked={filters.category === ''}
            onChange={() => update({ category: '' })}
          />
          All Categories
        </label>
        {categories.map(cat => (
          <label key={cat.id} className="filter-option">
            <input
              type="radio"
              name="category"
              checked={filters.category === cat.name}
              onChange={() => update({ category: cat.name })}
            />
            {cat.icon} {cat.name}
          </label>
        ))}
      </div>

      {/* Price */}
      <div className="filter-section">
        <div className="filter-title">Price Range (Rs.)</div>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={e => update({ minPrice: Number(e.target.value) || 0 })}
            min={0}
          />
          <span style={{ color: 'var(--text-muted)' }}>–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={e => update({ maxPrice: Number(e.target.value) || 2000 })}
            min={0}
          />
        </div>
      </div>

      {/* Availability */}
      <div className="filter-section">
        <div className="filter-title">Availability</div>
        {[
          { value: '', label: 'All' },
          { value: 'in-stock', label: 'In Stock' },
          { value: 'limited', label: 'Limited Stock' },
        ].map(opt => (
          <label key={opt.value} className="filter-option">
            <input
              type="radio"
              name="availability"
              checked={filters.availability === opt.value}
              onChange={() => update({ availability: opt.value })}
            />
            {opt.label}
          </label>
        ))}
      </div>

      {/* Prescription */}
      <div className="filter-section">
        <div className="filter-title">Prescription</div>
        {[
          { value: '', label: 'All Medicines' },
          { value: 'no', label: 'OTC (No Prescription)' },
          { value: 'yes', label: 'Prescription Required' },
        ].map(opt => (
          <label key={opt.value} className="filter-option">
            <input
              type="radio"
              name="prescription"
              checked={filters.prescription === opt.value}
              onChange={() => update({ prescription: opt.value })}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}
