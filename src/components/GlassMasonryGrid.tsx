import { Post } from '@/types/post';
import { GlassStickyNote } from './GlassStickyNote';
import { Loader2 } from 'lucide-react';

interface GlassMasonryGridProps {
  posts: Post[];
  loading: boolean;
  onLike: (postId: string, currentLikes: number) => Promise<boolean>;
}

export function GlassMasonryGrid({ posts, loading, onLike }: GlassMasonryGridProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <div className="absolute inset-0 w-10 h-10 rounded-full bg-primary/20 animate-ping" />
        </div>
        <p className="mt-4 text-muted-foreground animate-pulse">Loading the wall...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
        <div className="text-6xl mb-4 animate-float">📝</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">The wall is empty!</h3>
        <p className="text-muted-foreground">Be the first to leave your mark.</p>
      </div>
    );
  }

  return (
    <div className="masonry-grid px-4 md:px-8">
      {posts.map((post, index) => (
        <GlassStickyNote 
          key={post.id} 
          post={post} 
          onLike={onLike}
          isNew={index === 0}
          index={index}
        />
      ))}
    </div>
  );
}
