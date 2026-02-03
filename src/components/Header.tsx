import { Paintbrush, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="text-center py-8 px-4">
      <div className="inline-flex items-center justify-center gap-3 mb-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Paintbrush className="w-6 h-6 text-primary" />
          </div>
          <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1 animate-pulse" />
        </div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 font-handwritten">
        Digital Graffiti Wall
      </h1>
      
      <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base">
        Anonymous thoughts, jokes, confessions & ideas — all in one colorful place ✨
      </p>
    </header>
  );
}
