import { Header } from '@/components/Header';
import { HeroInput } from '@/components/HeroInput';
import { FilterBar } from '@/components/FilterBar';
import { TrendingSection } from '@/components/TrendingSection';
import { MasonryGrid } from '@/components/MasonryGrid';
import { usePosts } from '@/hooks/usePosts';

const Index = () => {
  const { 
    posts, 
    trendingPosts,
    loading, 
    filter, 
    setFilter, 
    reactions,
    userReactions,
    createPost, 
    addReaction,
    removeReaction,
  } = usePosts();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4">
        <Header />
        
        {/* Hero Post Form */}
        <section className="mb-12">
          <HeroInput onSubmit={createPost} />
        </section>

        {/* Trending */}
        <section className="px-4 md:px-8">
          <TrendingSection posts={trendingPosts} reactions={reactions} />
        </section>

        {/* Filter Bar */}
        <section>
          <FilterBar currentFilter={filter} onFilterChange={setFilter} />
        </section>

        {/* Masonry Grid */}
        <section className="pb-20">
          <MasonryGrid 
            posts={posts} 
            loading={loading} 
            reactions={reactions}
            userReactions={userReactions}
            onReact={addReaction}
            onUnreact={removeReaction}
          />
        </section>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>Made by Reddit Coded • Digital Grafitti • Share thoughts, not names 😎</p>
      </footer>
    </div>
  );
};

export default Index;