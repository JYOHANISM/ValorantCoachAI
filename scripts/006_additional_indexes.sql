-- Additional indexes for better performance
-- Create indexes for common query patterns

-- Index for profiles table queries
create index if not exists profiles_email_idx on public.profiles(email);
create index if not exists profiles_display_name_idx on public.profiles(display_name);
create index if not exists profiles_valorant_agent_idx on public.profiles(valorant_agent);
create index if not exists profiles_valorant_rank_idx on public.profiles(valorant_rank);

-- Index for chat sessions queries
create index if not exists chat_sessions_user_id_updated_at_idx on public.chat_sessions(user_id, updated_at desc);
create index if not exists chat_sessions_title_idx on public.chat_sessions(title);

-- Index for chat messages queries  
create index if not exists chat_messages_user_id_created_at_idx on public.chat_messages(user_id, created_at desc);
create index if not exists chat_messages_role_idx on public.chat_messages(role);

-- Composite index for efficient chat message retrieval
create index if not exists chat_messages_session_user_created_idx on public.chat_messages(session_id, user_id, created_at);
