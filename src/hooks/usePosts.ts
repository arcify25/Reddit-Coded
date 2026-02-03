import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Post, Category, STICKY_COLORS, Emoji, EMOJIS } from "@/types/post";
import { getUserFingerprint } from "@/lib/fingerprint";
import { toast } from "sonner";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [reactions, setReactions] = useState<
    Record<string, Record<Emoji, number>>
  >({});
  const [userReactions, setUserReactions] = useState<Record<string, Emoji[]>>(
    {},
  );

  const fingerprint = getUserFingerprint();

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts((data as Post[]) || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch reactions
  const fetchReactions = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("reactions").select("*");

      if (error) throw error;

      // Group reactions by post and emoji
      const reactionMap: Record<string, Record<Emoji, number>> = {};
      const userReactionMap: Record<string, Emoji[]> = {};

      (data || []).forEach((reaction) => {
        const emoji = reaction.emoji as Emoji;
        const postId = reaction.post_id;

        // Count reactions per post per emoji
        if (!reactionMap[postId]) {
          reactionMap[postId] = {} as Record<Emoji, number>;
        }
        reactionMap[postId][emoji] = (reactionMap[postId][emoji] || 0) + 1;

        // Track user's own reactions
        if (reaction.user_fingerprint === fingerprint) {
          if (!userReactionMap[postId]) {
            userReactionMap[postId] = [];
          }
          userReactionMap[postId].push(emoji);
        }
      });

      setReactions(reactionMap);
      setUserReactions(userReactionMap);
    } catch (error) {
      console.error("Error fetching reactions:", error);
    }
  }, [fingerprint]);

  // Create post
  const createPost = async (message: string, category: Category) => {
    const color =
      STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)];
    const rotation = Math.floor(Math.random() * 4 - 2); // Subtle rotation: -2, -1, 0, or 1

    try {
      const { data, error } = await supabase
        .from("posts")
        .insert({
          message,
          category,
          color,
          rotation,
        })
        .select();

      if (error) throw error;

      // Optimistically add the new post to the state
      if (data && data.length > 0) {
        setPosts((prev) => [data[0] as Post, ...prev]);
      }

      toast.success("Thought shared! 🎉");
      return true;
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to post. Try again!");
      return false;
    }
  };

  // Add reaction
  const addReaction = async (
    postId: string,
    emoji: Emoji,
  ): Promise<boolean> => {
    try {
      // Optimistically update reactions
      setReactions((prev) => {
        const updated = { ...prev };
        if (!updated[postId]) {
          updated[postId] = {} as Record<Emoji, number>;
        }
        updated[postId][emoji] = (updated[postId][emoji] || 0) + 1;
        return updated;
      });

      // Add user's own reaction
      setUserReactions((prev) => {
        const updated = { ...prev };
        if (!updated[postId]) {
          updated[postId] = [];
        }
        if (!updated[postId].includes(emoji)) {
          updated[postId].push(emoji);
        }
        return updated;
      });

      // Use RPC function to bypass schema cache issue
      const { data, error } = await supabase
        .rpc("add_user_reaction", {
          p_post_id: postId,
          p_emoji: emoji,
          p_fingerprint: fingerprint,
        })
        .then((res) => ({ data: res.data, error: res.error }))
        .catch((err) => {
          // Fallback to direct insert if RPC doesn't exist
          console.log("RPC failed, trying direct insert:", err);
          return null;
        });

      // If RPC failed, try direct insert
      if (data === null || error) {
        console.log("Attempting direct insert as fallback");
        const { error: insertError } = await supabase.from("reactions").insert({
          post_id: postId,
          emoji,
          user_fingerprint: fingerprint,
        } as any);

        if (insertError) {
          console.error("Insert Error:", insertError);

          if (insertError.code === "23505") {
            toast.info("You already reacted with this emoji!");
            // Revert optimistic update
            await fetchReactions();
            return false;
          }

          // For other errors, keep the optimistic update and just log
          console.log(
            "Error inserting, but keeping optimistic update:",
            insertError,
          );
          return true; // Return true to keep the UI update
        }
      }

      // Success - keep optimistic update
      console.log("Reaction added successfully");
      return true;
    } catch (error) {
      console.error("Error adding reaction:", error);
      // Don't show error toast - keep optimistic update
      console.log("Keeping optimistic update despite error");
      return true;
    }
  };

  // Remove reaction
  const removeReaction = async (
    postId: string,
    emoji: Emoji,
  ): Promise<boolean> => {
    try {
      // Optimistically update reactions
      setReactions((prev) => {
        const updated = { ...prev };
        if (updated[postId] && updated[postId][emoji] > 0) {
          updated[postId][emoji]--;
        }
        return updated;
      });

      // Remove from user's reactions
      setUserReactions((prev) => {
        const updated = { ...prev };
        if (updated[postId]) {
          updated[postId] = updated[postId].filter((e) => e !== emoji);
        }
        return updated;
      });

      const { error } = await supabase
        .from("reactions")
        .delete()
        .eq("post_id", postId)
        .eq("emoji", emoji)
        .eq("user_fingerprint", fingerprint);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error removing reaction:", error);
      toast.error("Failed to remove reaction");
      // Refetch to ensure UI is in sync
      await fetchReactions();
      return false;
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    fetchPosts();
    fetchReactions();

    const postsChannel = supabase
      .channel("posts-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPosts((prev) => [payload.new as Post, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setPosts((prev) =>
              prev.map((post) =>
                post.id === (payload.new as Post).id
                  ? (payload.new as Post)
                  : post,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setPosts((prev) =>
              prev.filter((post) => post.id !== (payload.old as Post).id),
            );
          }
        },
      )
      .subscribe();

    const reactionsChannel = supabase
      .channel("reactions-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reactions" },
        () => {
          // Refetch reactions on any change
          fetchReactions();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(reactionsChannel);
    };
  }, [fetchPosts, fetchReactions]);

  // Filter posts
  const filteredPosts =
    filter === "all" ? posts : posts.filter((post) => post.category === filter);

  // Get trending posts (by total reactions)
  const trendingPosts = [...posts]
    .map((post) => {
      const postReactions = reactions[post.id] || {};
      const totalReactions = Object.values(postReactions).reduce(
        (sum: number, count: number) => sum + count,
        0,
      );
      return { ...post, totalReactions };
    })
    .sort((a, b) => (b.totalReactions as number) - (a.totalReactions as number))
    .slice(0, 5);

  return {
    posts: filteredPosts,
    trendingPosts,
    loading,
    filter,
    setFilter,
    reactions,
    userReactions,
    createPost,
    addReaction,
    removeReaction,
    refetch: fetchPosts,
  };
}
