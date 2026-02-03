import { useState } from 'react';
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

interface PostFormProps {
  onSubmit: (message: string, category: Category) => Promise<boolean>;
}

const CATEGORIES: Category[] = ['Humor', 'Confession', 'Idea', 'Motivation'];

export function PostForm({ onSubmit }: PostFormProps) {
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<Category>('Humor');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-lg text-foreground">Share something fun!</h2>
        </div>

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, maxChars))}
          placeholder="What's on your mind? A joke, a thought, a secret dream... 🌟"
          className="min-h-[100px] resize-none bg-background/50 border-border/50 focus:border-primary text-foreground placeholder:text-muted-foreground font-body"
          disabled={isSubmitting}
        />

        <div className="flex items-center justify-between mt-4 gap-4">
          <div className="flex items-center gap-3">
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as Category)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-[160px] bg-background/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <span className="flex items-center gap-2">
                      <span>{CATEGORY_EMOJIS[cat]}</span>
                      <span>{cat}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className={`text-xs ${charCount > maxChars * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {charCount}/{maxChars}
            </span>
          </div>

          <Button 
            type="submit" 
            disabled={!message.trim() || isSubmitting}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Posting...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Post it!</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
