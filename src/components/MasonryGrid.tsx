import { Post } from '@/types/post';
import { StickyNote } from './StickyNote';
import { Loader2 } from 'lucide-react';

interface MasonryGridProps {
  posts: Post[];
  loading: boolean;
  onLike: (postId: string, currentLikes: number) => Promise<boolean>;
}

export function MasonryGrid({ posts, loading, onLike }: MasonryGridProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p>Loading the wall...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">The wall is empty!</h3>
        <p className="text-muted-foreground">Be the first to leave your mark.</p>
      </div>
    );
  }

  return (
    <div className="masonry-grid px-4 md:px-8">
      {posts.map((post, index) => (
        <StickyNote 
          key={post.id} 
          post={post} 
          onLike={onLike}
          isNew={index === 0}
        />
      ))}
    </div>
  );
}
