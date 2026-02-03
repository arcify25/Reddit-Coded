import { useState, useEffect } from 'react';
import { Category, CATEGORY_EMOJIS } from '@/types/post';
import { Button } from '@/components/ui/button';

interface GlassFilterBarProps {
  currentFilter: Category | 'all';
  onFilterChange: (filter: Category | 'all') => void;
}

const FILTERS: (Category | 'all')[] = ['all', 'Humor', 'Confession', 'Idea', 'Motivation'];

export function GlassFilterBar({ currentFilter, onFilterChange }: GlassFilterBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex flex-wrap gap-2 justify-center mb-8 transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      {FILTERS.map((filter, index) => (
        <Button
          key={filter}
          variant={currentFilter === filter ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onFilterChange(filter)}
          className={`rounded-full px-4 transition-all duration-300 hover:scale-105 ${
            currentFilter === filter 
              ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl' 
              : 'bg-background/50 backdrop-blur-sm hover:bg-background/80 border border-border/30'
          }`}
          style={{
            transitionDelay: `${index * 50}ms`
          }}
        >
          <span className="flex items-center gap-1.5">
            {filter === 'all' ? '✨' : CATEGORY_EMOJIS[filter]}
            <span className="capitalize">{filter === 'all' ? 'All' : filter}</span>
          </span>
        </Button>
      ))}
    </div>
  );
}
