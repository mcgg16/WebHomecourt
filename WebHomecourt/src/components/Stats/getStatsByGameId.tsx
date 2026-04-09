import { supabase } from "../../lib/supabase"

export type PlayerStat = { 
  team_player_stats_id: number
  game_id: number
  team_player_id: number
  first_name: string,
  last_name: string,
  full_name: string,
  minutes: string
  points: number
  rebounds: number
  assists: number
  steals: number
  turnovers: number
  field_made: number
  field_attempted: number
};


export async function getStatsByGameId(game_id: number): Promise<PlayerStat[]> {
  if (!game_id) {
    throw new Error("No game selected to display")
  }

  const { data, error } = await supabase
    .from("view_player_stats")
    .select(`
      team_player_stats_id,
      game_id,
      team_player_id,
      first_name,
      last_name,
      full_name,
      minutes,
      points,
      rebounds,
      assists,
      steals,
      turnovers,
      field_made,
      field_attempted
    `)
    .eq("game_id", game_id)

  if (error) {
    console.error("Supabase error:", error.message)
    throw new Error("Failed to fetch stats")
  }

  return data ?? []
}
