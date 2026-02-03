import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Post, Category, STICKY_COLORS } from '@/types/post';
import { toast } from 'sonner';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Category | 'all'>('all');

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts((data as Post[]) || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create post
  const createPost = async (message: string, category: Category) => {
    const color = STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)];
    const rotation = Math.random() * 6 - 3; // -3 to 3 degrees

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          message,
          category,
          color,
          rotation,
        });

      if (error) throw error;
      toast.success('Posted to the wall! 🎉');
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to post. Try again!');
      return false;
    }
  };

  // Like post
  const likePost = async (postId: string, currentLikes: number) => {
    // Check if already liked in this session
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    if (likedPosts.includes(postId)) {
      toast.info('You already liked this! 💕');
      return false;
    }

    // Optimistic update
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 } 
          : post
      )
    );

    try {
      const { error } = await supabase
        .from('posts')
        .update({ likes: currentLikes + 1 })
        .eq('id', postId);

      if (error) throw error;

      // Save to localStorage to prevent spam
      localStorage.setItem('likedPosts', JSON.stringify([...likedPosts, postId]));
      return true;
    } catch (error) {
      // Revert optimistic update
      setPosts(prev => 
        prev.map(post => 
          post.id === postId 
            ? { ...post, likes: currentLikes } 
            : post
        )
      );
      console.error('Error liking post:', error);
      toast.error('Failed to like. Try again!');
      return false;
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPosts(prev => [payload.new as Post, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setPosts(prev => 
              prev.map(post => 
                post.id === (payload.new as Post).id ? payload.new as Post : post
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setPosts(prev => prev.filter(post => post.id !== (payload.old as Post).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPosts]);

  // Filter posts
  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.category === filter);

  // Get trending posts (most liked)
  const trendingPosts = [...posts]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);

  return {
    posts: filteredPosts,
    trendingPosts,
    loading,
    filter,
    setFilter,
    createPost,
    likePost,
    refetch: fetchPosts,
  };
}
