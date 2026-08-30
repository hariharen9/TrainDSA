-- RPC function to allow users to completely delete their own account and all data
create or replace function public.delete_user_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Explicitly delete user rows from public tables (in case FK cascade is delayed)
  delete from public.progress_entries where user_id = current_user_id;
  delete from public.streak_logs where user_id = current_user_id;

  -- Delete from auth.users (cascades any remaining auth links/identities)
  delete from auth.users where id = current_user_id;
end;
$$;

-- Grant execution to authenticated users
grant execute on function public.delete_user_account() to authenticated;
