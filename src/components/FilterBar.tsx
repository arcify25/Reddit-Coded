import { Category, CATEGORY_EMOJIS } from '@/types/post';
import { Button } from '@/components/ui/button';

interface FilterBarProps {
  currentFilter: Category | 'all';
  onFilterChange: (filter: Category | 'all') => void;
}

const FILTERS: (Category | 'all')[] = ['all', 'Humor', 'Confession', 'Idea', 'Motivation'];

export function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {FILTERS.map((filter) => (
        <Button
          key={filter}
          variant={currentFilter === filter ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(filter)}
          className={`rounded-full transition-all ${
            currentFilter === filter 
              ? 'bg-primary text-primary-foreground shadow-md' 
              : 'bg-background/50 hover:bg-background border-border/50'
          }`}
        >
          {filter === 'all' ? (
            <span>✨ All</span>
          ) : (
            <span className="flex items-center gap-1">
              <span>{CATEGORY_EMOJIS[filter]}</span>
              <span>{filter}</span>
            </span>
          )}
        </Button>
      ))}
    </div>
  );
}
