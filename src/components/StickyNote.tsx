import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Post, CATEGORY_EMOJIS, CATEGORY_BADGE_CLASSES } from '@/types/post';
import { formatDistanceToNow } from 'date-fns';
import confetti from 'canvas-confetti';

interface StickyNoteProps {
  post: Post;
  onLike: (postId: string, currentLikes: number) => Promise<boolean>;
  isNew?: boolean;
}

export function StickyNote({ post, onLike, isNew }: StickyNoteProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
  const hasLiked = likedPosts.includes(post.id);

  const handleLike = async () => {
    if (isLiking || hasLiked) return;
    
    setIsLiking(true);
    const success = await onLike(post.id, post.likes);
    
    // Trigger confetti when reaching 25 likes
    if (success && post.likes + 1 === 25) {
      setShowConfetti(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD93D', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181'],
      });
    }
    
    setIsLiking(false);
  };

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <div 
      className={`masonry-item ${isNew ? 'animate-bounce-in' : 'animate-fade-in-up'}`}
      style={{ 
        animationDelay: isNew ? '0s' : `${Math.random() * 0.3}s`,
        opacity: isNew ? 1 : 0,
      }}
    >
      <article
        className={`sticky-note ${post.color} p-5 pt-6 relative`}
        style={{ transform: `rotate(${post.rotation}deg)` }}
      >
        {/* Pin */}
        <div className="pin" />

        {/* Category badge */}
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mb-3 ${CATEGORY_BADGE_CLASSES[post.category]}`}>
          <span>{CATEGORY_EMOJIS[post.category]}</span>
          <span>{post.category}</span>
        </div>

        {/* Message */}
        <p className="font-handwritten text-xl leading-relaxed text-foreground mb-4">
          {post.message}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
          {/* Like button */}
          <button
            onClick={handleLike}
            disabled={isLiking || hasLiked}
            className={`like-button flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors ${
              hasLiked 
                ? 'text-destructive' 
                : 'text-muted-foreground hover:text-destructive'
            }`}
            aria-label={`Like this post. ${post.likes} likes`}
          >
            <Heart 
              className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} 
            />
            <span className="font-semibold text-sm">{post.likes}</span>
          </button>

          {/* Timestamp */}
          <span className="text-xs text-muted-foreground">
            {timeAgo}
          </span>
        </div>

        {/* Fire emoji for trending */}
        {post.likes >= 10 && (
          <div className="absolute -top-1 -right-1 text-lg animate-float">
            🔥
          </div>
        )}
      </article>
    </div>
  );
}
