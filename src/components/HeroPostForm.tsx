import { useState, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Category, CATEGORY_EMOJIS } from '@/types/post';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTypewriter } from '@/hooks/useTypewriter';

interface HeroPostFormProps {
  onSubmit: (message: string, category: Category) => Promise<boolean>;
}

const CATEGORIES: Category[] = ['Humor', 'Confession', 'Idea', 'Motivation'];
const PLACEHOLDER = "What's on your mind today? ✨";

export function HeroPostForm({ onSubmit }: HeroPostFormProps) {
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<Category>('Humor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const { displayText: typedPlaceholder, isComplete } = useTypewriter(PLACEHOLDER, 40, 800);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onSubmit(message.trim(), category);
    
    if (success) {
      setMessage('');
    }
    setIsSubmitting(false);
  };

  const charCount = message.length;
  const maxChars = 280;

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`w-full max-w-2xl mx-auto transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      }`}
    >
      <div className={`glass-card p-6 md:p-8 relative overflow-hidden transition-all duration-500 ${
        isFocused ? 'ring-2 ring-primary/30 shadow-glow' : ''
      }`}>
        {/* Animated glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Sparkle decorations */}
        <div className="absolute -top-2 -right-2 text-2xl animate-float opacity-60">✨</div>
        <div className="absolute -bottom-1 -left-1 text-xl animate-float opacity-40" style={{ animationDelay: '1s' }}>💫</div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <h2 className="font-semibold text-lg text-foreground">Share something amazing!</h2>
          </div>

          <div className="relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, maxChars))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isComplete ? PLACEHOLDER : typedPlaceholder}
              className="min-h-[120px] resize-none bg-background/30 backdrop-blur-sm border-border/30 focus:border-primary/50 text-foreground placeholder:text-muted-foreground font-body text-lg transition-all duration-300"
              disabled={isSubmitting}
            />
            
            {/* Character count ring */}
            <div className="absolute bottom-3 right-3">
              <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="2"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="none"
                  stroke={charCount > maxChars * 0.9 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
                  strokeWidth="2"
                  strokeDasharray={`${(charCount / maxChars) * 88} 88`}
                  className="transition-all duration-300"
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${
                charCount > maxChars * 0.9 ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {maxChars - charCount}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 gap-4 flex-wrap">
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as Category)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-[180px] bg-background/30 backdrop-blur-sm border-border/30 hover:border-primary/50 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="backdrop-blur-md bg-popover/95">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="cursor-pointer">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{CATEGORY_EMOJIS[cat]}</span>
                      <span>{cat}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              type="submit" 
              disabled={!message.trim() || isSubmitting}
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 min-w-[120px]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Posting...</span>
                </span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Post it!</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
