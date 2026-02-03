import { TrendingUp, Heart } from 'lucide-react';
import { Post, CATEGORY_EMOJIS } from '@/types/post';

interface TrendingSectionProps {
  posts: Post[];
}

export function TrendingSection({ posts }: TrendingSectionProps) {
  if (posts.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Trending Now 🔥</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 border border-border/30 text-xs"
            >
              <span className="font-bold text-primary">#{index + 1}</span>
              <span>{CATEGORY_EMOJIS[post.category]}</span>
              <span className="max-w-[120px] truncate text-foreground/80">
                {post.message}
              </span>
              <span className="flex items-center gap-0.5 text-destructive">
                <Heart className="w-3 h-3 fill-current" />
                {post.likes}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
