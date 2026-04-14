import { supabase } from '../lib/supabase'

export async function getCurrentUserReputation(): Promise<number | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user?.id) {
    return null
  }

  const { data, error } = await supabase
    .from('user_laker')
    .select('reputation')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    return null
  }

  return data?.reputation ?? null
}
