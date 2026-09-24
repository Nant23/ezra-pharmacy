import { useRef } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onSearch?: () => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, onSearch, placeholder = 'Search medicines, brands, categories...' }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch?.();
  };

  return (
    <div className="search-bar">
      <div className="search-bar-icon">
        <Search size={18} />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder}
        aria-label="Search medicines"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{ padding: '0 12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
      <button className="search-bar-btn" onClick={onSearch} aria-label="Search">
        <Search size={16} />
        Search
      </button>
    </div>
  );
}
