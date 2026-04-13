import { supabase } from "../../lib/supabase"

export type TeamStat = { 
    game_id: number
    team_id: number 
    total_points:  number 
    total_rebounds: number 
    total_assists: number 
    total_steals: number 
    total_turnovers: number 
    total_field_made: number 
    total_field_attempted: number 
};

export async function getTeamStatsByGameId(game_id: number): Promise<TeamStat[]> {
  if (!game_id) {
    throw new Error("No game selected to display")
  }

  const { data, error } = await supabase
    .from("team_stats_comparision")
    .select(`
      game_id,
      team_id,
      total_points,
      total_rebounds,
      total_assists,
      total_steals,
      total_turnovers,
      total_field_made,
      total_field_attempted
    `)
    .eq("game_id", game_id)

  if (error) {
    console.error("Supabase error:", error.message)
    throw new Error("Failed to fetch stats")
  }

  return data ?? []
}
