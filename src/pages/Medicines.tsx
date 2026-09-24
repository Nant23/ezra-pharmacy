import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { medicines } from '../data/medicines';
import type { FilterState } from '../types';
import MedicineCard from '../components/medicine/MedicineCard';
import SearchBar from '../components/medicine/SearchBar';
import ProductFilter from '../components/medicine/ProductFilter';
import Pagination from '../components/ui/Pagination';

const defaultFilters: FilterState = {
  category: '', minPrice: 0, maxPrice: 2000,
  sortBy: 'default', availability: '', prescription: ''
};

const PER_PAGE = 9;

export default function Medicines() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    category: searchParams.get('category') || ''
  });
  const [page, setPage] = useState(1);
  const [showFilterMobile, setShowFilterMobile] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category') || '';
    setFilters(f => ({ ...f, category: cat }));
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...medicines];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.tags?.some(t => t.includes(q))
      );
    }
    if (filters.category) list = list.filter(m => m.category === filters.category);
    if (filters.availability) list = list.filter(m => m.availability === filters.availability);
    if (filters.prescription === 'yes') list = list.filter(m => m.requiresPrescription);
    if (filters.prescription === 'no') list = list.filter(m => !m.requiresPrescription);
    list = list.filter(m => m.price >= filters.minPrice && m.price <= (filters.maxPrice || 99999));
    switch (filters.sortBy) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'discount': list.sort((a, b) => (b.discount || 0) - (a.discount || 0)); break;
    }
    return list;
  }, [search, filters]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleFilterChange = (f: FilterState) => {
    setFilters(f);
    setPage(1);
    if (f.category) {
      setSearchParams({ category: f.category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--green-50), white)', borderBottom: '1px solid var(--border)', padding: '40px 0 32px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <div className="section-label" style={{ marginBottom: '8px' }}>Our Catalog</div>
              <h1 className="heading-lg">
                {filters.category || 'All Medicines'}
              </h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
                {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
              </p>
            </div>
            {filters.category && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handleFilterChange({ ...filters, category: '' })}
              >
                <X size={14} /> Clear Category
              </button>
            )}
          </div>
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      <div className="container section-sm">
        {/* Mobile filter toggle */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-ghost"
            onClick={() => setShowFilterMobile(!showFilterMobile)}
            style={{ display: 'none' }} // shown via CSS at mobile
            id="filter-toggle-btn"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        <div className="medicines-layout">
          {/* Filter Panel */}
          <div className={showFilterMobile ? '' : ''}>
            <ProductFilter filters={filters} onChange={handleFilterChange} />
          </div>

          {/* Grid */}
          <div>
            {paginated.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <div className="empty-title">No medicines found</div>
                <div className="empty-desc">Try different keywords or adjust your filters</div>
                <button className="btn btn-primary" onClick={() => { setSearch(''); setFilters(defaultFilters); }}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="medicines-grid">
                  {paginated.map(med => (
                    <MedicineCard key={med.id} medicine={med} />
                  ))}
                </div>
                <Pagination current={page} total={totalPages} onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
