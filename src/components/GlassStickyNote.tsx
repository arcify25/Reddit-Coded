import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Post, CATEGORY_EMOJIS, CATEGORY_BADGE_CLASSES } from '@/types/post';
import { formatDistanceToNow } from 'date-fns';
import confetti from 'canvas-confetti';

interface GlassStickyNoteProps {
  post: Post;
  onLike: (postId: string, currentLikes: number) => Promise<boolean>;
  isNew?: boolean;
  index?: number;
}

export function GlassStickyNote({ post, onLike, isNew, index = 0 }: GlassStickyNoteProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({ transform: '' });
  
  const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
  const hasLiked = likedPosts.includes(post.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isHovered) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({ transform: '' });
  };

  const handleLike = async () => {
    if (isLiking || hasLiked) return;
    
    setIsLiking(true);
    const success = await onLike(post.id, post.likes);
    
    if (success && post.likes + 1 === 25) {
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
      className="masonry-item"
      style={{ 
        animationDelay: isNew ? '0s' : `${index * 0.05}s`,
      }}
    >
      <article
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`glass-note ${post.color} p-5 pt-6 relative transition-all duration-300 ease-out ${
          isNew ? 'animate-bounce-in' : 'animate-fade-in-up'
        }`}
        style={{ 
          ...tiltStyle,
          '--rotation': `${post.rotation}deg`,
        } as React.CSSProperties}
      >
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        
        {/* Pin with glow */}
        <div className="pin-glow" />

        {/* Category badge */}
        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mb-3 backdrop-blur-sm ${CATEGORY_BADGE_CLASSES[post.category]}`}>
          <span>{CATEGORY_EMOJIS[post.category]}</span>
          <span>{post.category}</span>
        </div>

        {/* Message */}
        <p className="font-handwritten text-xl leading-relaxed text-foreground mb-4 relative z-10">
          {post.message}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-foreground/10 relative z-10">
          {/* Like button */}
          <button
            onClick={handleLike}
            disabled={isLiking || hasLiked}
            className={`like-button-enhanced flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
              hasLiked 
                ? 'text-destructive bg-destructive/10' 
                : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
            }`}
            aria-label={`Like this post. ${post.likes} likes`}
          >
            <Heart 
              className={`w-4 h-4 transition-transform ${hasLiked ? 'fill-current scale-110' : ''} ${isLiking ? 'animate-ping' : ''}`} 
            />
            <span className="font-semibold text-sm">{post.likes}</span>
          </button>

          {/* Timestamp */}
          <span className="text-xs text-muted-foreground">
            {timeAgo}
          </span>
        </div>

        {/* Trending fire badge */}
        {post.likes >= 10 && (
          <div className="absolute -top-1 -right-1 text-lg animate-float">
            🔥
          </div>
        )}
      </article>
    </div>
  );
}
