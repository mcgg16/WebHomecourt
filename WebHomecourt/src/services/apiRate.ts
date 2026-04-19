import { supabase } from '../lib/supabase'
//Para lo que devuelve get_pending_rating

type PendingRatingRow = {
  user_event_id: number
  event_id: number
  event_name: string | null
  event_date: string | null
}

// Para lo qe devuelve get_players_played_with
type PlayedWithPlayer = {
  user_id: string
  nickname: string | null
  username: string | null
  photo_url: string | null
  reputation: number | null
  event_id: number | null
  event_name: string | null
  event_date: string | null
}

//para el rated_user_id que da user_event_raitirngs

type UserEventRatingRow = {
  rated_user_id: string
}

//Pa el frnt
export type RatePlayer = {
  id: string
  avatarUrl: string
  playerName: string
  playerTag: string
  initialRating: number
}

// Pa guardar los raitinds en lo que en lo que se envuian
export type PendingRateResponse = {
  userEventId: number
  eventId: number
  eventName: string | null
  eventDate: string | null
  courtName: string | null
  courtDirection: string | null
  players: RatePlayer[]
}

// Llama a getpandiong raiting para ver  si falta uno y ve cuakes faltan por calificar del evento. 
export async function getPendingRatingPlayers(): Promise<PendingRateResponse | null> {
  const {data: { user },error: userError} = await supabase.auth.getUser()

  if (userError || !user?.id) {
    throw new Error('')
  }

  const { data: pendingData, error: pendingError } = await supabase.rpc('get_pending_rating', {
    p_user_id: user.id,
  })

  if (pendingError) {
    throw new Error('No se pudo verificar si tienes calificaciones pendientes')
  }

  const pendingRows = (pendingData ?? []) as PendingRatingRow[]
  const pending = pendingRows[0]

  if (!pending) {
    return null
  }

  let courtName: string | null = null
  let courtDirection: string | null = null

  const { data: eventRow, error: eventError } = await supabase
    .from('event')
    .select('court_id')
    .eq('event_id', pending.event_id)
    .limit(1)
    .maybeSingle()

  if (!eventError && eventRow?.court_id !== null && eventRow?.court_id !== undefined) {
    const { data: courtRow, error: courtError } = await supabase
      .from('court')
      .select('name, direction')
      .eq('court_id', Number(eventRow.court_id))
      .limit(1)
      .maybeSingle()

    if (!courtError) {
      courtName = courtRow?.name ?? null
      courtDirection = courtRow?.direction ?? null
    }
  }

  const { data, error } = await supabase.rpc('get_players_played_with', {
    p_user_id: user.id,
  })

  if (error) {
    throw new Error('No se pudieron cargar los jugadores con los que jugaste')
  }

  const rows = ((data ?? []) as PlayedWithPlayer[]).filter(
    (player) => player.event_id === pending.event_id
  )

  // Evita repetir cards y conflictos 409 cuando un jugador ya fue calificado en ese evento.
  const uniquePlayers = rows.reduce<PlayedWithPlayer[]>((acc, row) => {
    if (acc.some((player) => player.user_id === row.user_id)) return acc
    acc.push(row)
    return acc
  }, [])

  const { data: ratedUsersData, error: ratedUsersError } = await supabase
    .from('user_event_ratings')
    .select('rated_user_id')
    .eq('user_event_id', pending.user_event_id)

  if (ratedUsersError) {
    throw new Error('No se pudieron cargar las calificaciones existentes')
  }

  const ratedUsers = new Set<string>(
    ((ratedUsersData ?? []) as UserEventRatingRow[]).map((row) => row.rated_user_id)
  )

  const players = uniquePlayers
    .filter((player) => !ratedUsers.has(player.user_id))
    .map((player) => ({
    id: player.user_id,
    avatarUrl: player.photo_url || 'https://i.pravatar.cc/150',
    playerName: player.nickname || player.username || 'Jugador',
    playerTag: `@${player.username || 'sin_usuario'}`,
    initialRating: 0,
  }))

  return {
    userEventId: pending.user_event_id,
    eventId: pending.event_id,
    eventName: pending.event_name,
    eventDate: pending.event_date,
    courtName,
    courtDirection,
    players,
  }
}

export async function saveUserEventRating(
  userEventId: number,
  ratedUserId: string,
  rating: number
): Promise<void> {
  const { error } = await supabase.from('user_event_ratings').upsert(
    {
      user_event_id: userEventId,
      rated_user_id: ratedUserId,
      rating,
    },
    {
      onConflict: 'user_event_id,rated_user_id',
      ignoreDuplicates: true,
    }
  )

  if (error) {
    throw new Error('No se pudo guardar la calificacion')
  }
}

export async function markUserEventAsRated(userEventId: number): Promise<void> {
  const { error } = await supabase
    .from('user_event')
    .update({ rated_others: true })
    .eq('user_event_id', userEventId)

  if (error) {
    throw new Error(`No se pudo actualizar rated_others: ${error.message}`)
  }
}
