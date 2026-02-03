-- Create RPC function to handle reaction insertion (bypassing schema cache issue)
CREATE OR REPLACE FUNCTION add_user_reaction(
  p_post_id uuid,
  p_emoji text,
  p_fingerprint text
)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  INSERT INTO public.reactions (post_id, emoji, user_fingerprint)
  VALUES (p_post_id, p_emoji, p_fingerprint)
  ON CONFLICT DO NOTHING;
  
  SELECT json_build_object('success', true) INTO result;
  RETURN result;
EXCEPTION WHEN unique_violation THEN
  RETURN json_build_object('error', 'already_reacted');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION add_user_reaction(uuid, text, text) TO anon, authenticated;
