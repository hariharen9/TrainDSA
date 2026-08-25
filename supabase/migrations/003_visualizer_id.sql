-- Adds an optional pointer from a topic to a client-side interactive visualizer component.
-- Null means the topic has no interactive explainer yet and only renders concept/gotchas markdown.

alter table public.topics
  add column if not exists visualizer_id text;
