import { useRef } from 'react';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Post, Emoji, CATEGORY_EMOJIS } from '@/types/post';
import { Button } from '@/components/ui/button';

interface TrendingSectionProps {
  posts: Post[];
  reactions: Record<string, Record<Emoji, number>>;
}

export function TrendingSection({ posts, reactions }: TrendingSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <section className="my-8 animate-fade-in delay-200">
      {/* Section background with subtle contrast */}
      <div className="relative -mx-4 px-4 py-6 bg-gradient-to-b from-secondary/30 via-secondary/20 to-transparent rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 px-2">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div className="absolute inset-0 rounded-xl bg-primary/20 animate-pulse" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Trending Now
              </h2>
              <p className="text-xs text-muted-foreground">Most popular thoughts</p>
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full bg-secondary/50 hover:bg-secondary border border-border/50 transition-all duration-200 hover:scale-105"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full bg-secondary/50 hover:bg-secondary border border-border/50 transition-all duration-200 hover:scale-105"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable container with edge fades */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background/80 to-transparent z-10 pointer-events-none rounded-l-xl" />

          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background/80 to-transparent z-10 pointer-events-none rounded-r-xl" />

          {/* Cards container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto overflow-y-visible pb-2 px-2 scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {posts.slice(0, 8).map((post, index) => {
              const postReactions = reactions[post.id] || {};
              const totalReactions = Object.values(postReactions).reduce((sum: number, count: number) => sum + count, 0);
              const isTopThree = index < 3;

              return (
                <div
                  key={post.id}
                  className={`
                    relative flex-shrink-0 w-64 p-5 rounded-2xl bg-card border border-border/50
                    transition-all duration-300 ease-out cursor-pointer group
                    hover:bg-card/80 hover:-translate-y-2 hover:shadow-xl
                    ${isTopThree ? 'ring-1 ring-primary/20 shadow-lg shadow-primary/5' : 'shadow-md'}
                  `}
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  {/* Rank badge */}
                  <div className={`
                    absolute -top-3.6 -left-2.5 w-7 h-7 rounded-full flex items-center justify-center 
                    text-sm font-bold shadow-md transition-transform duration-300 group-hover:scale-110
                    z-20 ${isTopThree
                      ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground'
                      : 'bg-secondary text-foreground border border-border'
                    }
                  `}>
                    {index + 1}
                  </div>

                  {/* Category tag */}
                  <div className="flex items-center gap-1.5 mb-2 ">
                    <span className="text-base">{CATEGORY_EMOJIS[post.category]}</span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {post.category}
                    </span>
                  </div>

                  {/* Message preview */}
                  <p className="text-sm text-foreground leading-relaxed line-clamp-3 mb-4 font-body">
                    {post.message}
                  </p>

                  {/* Stats footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="text-sm">❤️</span>
                      <span className="text-xs font-medium">
                        {Number(totalReactions) > 0 ? Number(totalReactions) : post.likes}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground/70">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Hover glow for top cards */}
                  {isTopThree && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
