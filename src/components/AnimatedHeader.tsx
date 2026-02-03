import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export function AnimatedHeader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className={`py-8 md:py-12 text-center transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <div className="relative inline-block">
        {/* Floating sparkles */}
        <Sparkles className="absolute -top-4 -left-6 w-5 h-5 text-primary/60 animate-float" />
        <Sparkles className="absolute -top-2 -right-8 w-4 h-4 text-accent/60 animate-float" style={{ animationDelay: '0.5s' }} />
        <Sparkles className="absolute -bottom-2 -left-4 w-3 h-3 text-primary/40 animate-float" style={{ animationDelay: '1s' }} />
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-handwritten font-bold text-foreground mb-2">
          <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
            Digital Graffiti Wall
          </span>
        </h1>
      </div>
      
      <p className={`text-muted-foreground text-lg mt-2 transition-all duration-700 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}>
        Express yourself anonymously ✨
      </p>
    </header>
  );
}
