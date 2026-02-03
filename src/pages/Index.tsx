import { AnimatedHeader } from '@/components/AnimatedHeader';
import { HeroPostForm } from '@/components/HeroPostForm';
import { GlassFilterBar } from '@/components/GlassFilterBar';
import { GlassTrendingSection } from '@/components/GlassTrendingSection';
import { GlassMasonryGrid } from '@/components/GlassMasonryGrid';
import { FloatingParticles } from '@/components/FloatingParticles';
import { usePosts } from '@/hooks/usePosts';

const Index = () => {
  const { 
    posts, 
    trendingPosts,
    loading, 
    filter, 
    setFilter, 
    createPost, 
    likePost 
  } = usePosts();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating particles background */}
      <FloatingParticles />
      
      {/* Ambient gradient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <AnimatedHeader />
        
        <main className="container max-w-7xl mx-auto pb-20">
          {/* Hero Post Form */}
          <section className="mb-12 px-4">
            <HeroPostForm onSubmit={createPost} />
          </section>

          {/* Trending */}
          <section className="px-4">
            <GlassTrendingSection posts={trendingPosts} />
          </section>

          {/* Filter Bar */}
          <section className="px-4">
            <GlassFilterBar currentFilter={filter} onFilterChange={setFilter} />
          </section>

          {/* Masonry Grid */}
          <section>
            <GlassMasonryGrid 
              posts={posts} 
              loading={loading} 
              onLike={likePost} 
            />
          </section>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/30 backdrop-blur-sm bg-background/30">
          <p>Made with 💕 • Share thoughts, not names</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
