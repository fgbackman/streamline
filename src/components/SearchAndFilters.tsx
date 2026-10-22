import React, { useRef, useEffect } from 'react';
import { Search, X, DownloadCloud, Sparkles, Filter } from 'lucide-react';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSubmitSearch?: () => void;
  searchStatus?: { tone: 'info' | 'error'; text: string } | null;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isDarkMode: boolean;
  totalResults: number;
  isOfflineMode: boolean;
  onToggleOfflineOnly: () => void;
}

const CATEGORIES = [
  'All',
  'Offline Saved',
  'Design',
  'Engineering',
  'Space',
  'Ambient',
  'Science'
];

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  onSubmitSearch,
  searchStatus,
  selectedCategory,
  onSelectCategory,
  isDarkMode,
  totalResults,
  isOfflineMode,
  onToggleOfflineOnly,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' or 'Cmd+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.metaKey && e.key === 'k')) && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-2.5">
      {/* Search Input Bar */}
      <form
        role="search"
        className="relative flex items-center"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitSearch?.();
          searchInputRef.current?.blur();
        }}
      >
        <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>

        <input
          ref={searchInputRef}
          type="search"
          enterKeyHint="search"
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Search YouTube"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search YouTube — press Enter"
          className={`w-full h-10 sm:h-9 pl-10 pr-24 text-base sm:text-xs rounded-lg [&::-webkit-search-cancel-button]:hidden transition-all outline-none border ${
            isDarkMode
              ? 'bg-[#1e2025] border-white/10 text-neutral-100 placeholder:text-neutral-500 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20'
              : 'bg-white border-black/10 text-neutral-900 placeholder:text-neutral-400 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20'
          }`}
        />

        <div className="absolute right-2.5 flex items-center gap-1.5 text-neutral-400">
          {searchQuery ? (
            <>
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="p-1 hover:text-neutral-200 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button
                type="submit"
                className="px-2 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold transition-colors"
              >
                Search
              </button>
            </>
          ) : (
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
              isDarkMode ? 'border-white/10 text-neutral-400 bg-white/5' : 'border-black/10 text-neutral-500 bg-black/5'
            }`}>
              /
            </span>
          )}
        </div>
      </form>

      {searchStatus && (
        <div
          role="status"
          className={`text-[11px] px-1 ${searchStatus.tone === 'error' ? 'text-rose-400' : 'text-neutral-400'}`}
        >
          {searchStatus.text}
        </div>
      )}

      {/* Interactive Category Filter Tabs (Zero-pill buttons per design constitution) */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1">
          {CATEGORIES.map((cat) => {
            const isOfflineTab = cat === 'Offline Saved';
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? isDarkMode
                      ? 'bg-neutral-200 text-neutral-950 font-semibold shadow-sm'
                      : 'bg-neutral-900 text-white font-semibold shadow-sm'
                    : isDarkMode
                      ? 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.05]'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-black/[0.05]'
                }`}
              >
                {isOfflineTab && <DownloadCloud className="w-3 h-3 text-amber-500" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Total Results Count */}
        <div className="text-[11px] font-mono text-neutral-400 whitespace-nowrap shrink-0 hidden sm:block">
          {totalResults} {totalResults === 1 ? 'video' : 'videos'}
        </div>
      </div>
    </div>
  );
};
