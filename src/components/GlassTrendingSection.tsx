import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { Post, CATEGORY_EMOJIS } from '@/types/post';
import { Button } from '@/components/ui/button';

interface GlassTrendingSectionProps {
  posts: Post[];
}

export function GlassTrendingSection({ posts }: GlassTrendingSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (posts.length === 0) return null;

  return (
    <div className={`mb-10 transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Flame className="w-5 h-5 text-primary" />
            <div className="absolute inset-0 w-5 h-5 text-primary animate-ping opacity-30">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-semibold text-lg text-foreground">Trending Now</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full hover:bg-primary/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full hover:bg-primary/10 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {posts.map((post, index) => (
          <div
            key={post.id}
            className={`flex-shrink-0 w-64 glass-card p-4 relative group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1`}
            style={{ 
              animationDelay: `${index * 0.1}s`,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: `all 0.5s ease-out ${index * 0.1}s`
            }}
          >
            {/* Rank badge */}
            <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-gradient-to-br from-primary to-destructive flex items-center justify-center text-primary-foreground text-sm font-bold shadow-lg z-10">
              {index + 1}
            </div>

            {/* Category */}
            <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
              <span>{CATEGORY_EMOJIS[post.category]}</span>
              <span>{post.category}</span>
            </div>

            {/* Message preview */}
            <p className="font-handwritten text-lg line-clamp-3 text-foreground mb-3">
              {post.message}
            </p>

            {/* Likes */}
            <div className="flex items-center gap-1 text-destructive">
              <span className="text-sm">❤️</span>
              <span className="font-semibold text-sm">{post.likes}</span>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
