-- Force schema cache refresh by renaming and recreating the column
BEGIN;

-- Drop the existing constraint temporarily
ALTER TABLE public.reactions DROP CONSTRAINT IF EXISTS reactions_post_id_emoji_user_fingerprint_key;

-- Rename column to trigger schema cache update
ALTER TABLE public.reactions RENAME COLUMN user_fingerprint TO fingerprint;

-- Recreate the unique constraint with new column name
ALTER TABLE public.reactions ADD UNIQUE(post_id, emoji, fingerprint);

COMMIT;
