import { Header } from '@/components/Header';
import { PostForm } from '@/components/PostForm';
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
    createPost, 
    likePost 
  } = usePosts();

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container max-w-7xl mx-auto pb-20">
        {/* Post Form */}
        <section className="mb-8 px-4">
          <PostForm onSubmit={createPost} />
        </section>

        {/* Trending */}
        <section className="px-4">
          <TrendingSection posts={trendingPosts} />
        </section>

        {/* Filter Bar */}
        <section className="mb-8 px-4">
          <FilterBar currentFilter={filter} onFilterChange={setFilter} />
        </section>

        {/* Masonry Grid */}
        <section>
          <MasonryGrid 
            posts={posts} 
            loading={loading} 
            onLike={likePost} 
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/30">
        <p>Made with 💕 • Share thoughts, not names</p>
      </footer>
    </div>
  );
};

export default Index;
