import { supabase } from '../lib/supabase'

export interface UserActivityStats {
  eventsCreated: number
  eventsAttended: number
}

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

export async function getCurrentUserActivity(): Promise<UserActivityStats | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user?.id) {
    return null
  }

  const { data, error } = await supabase
    .rpc('get_user_stats', { p_user_id: user.id })
    .single()

  if (error || !data) {
    return null
  }

  const row = data as {
    events_created?: number | string | null
    events_attended?: number | string | null
  }

  const parsedEventsCreated = Number(row.events_created ?? 0)
  const parsedEventsAttended = Number(row.events_attended ?? 0)

  return {
    eventsCreated: Number.isFinite(parsedEventsCreated) ? parsedEventsCreated : 0,
    eventsAttended: Number.isFinite(parsedEventsAttended) ? parsedEventsAttended : 0,
  }
}
