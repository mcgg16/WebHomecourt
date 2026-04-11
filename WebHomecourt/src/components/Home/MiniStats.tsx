import { supabase } from "../../lib/supabase"
import { useEffect, useState } from "react"

export type MarcadorJuego = {
  game_id: number;
  lakers_name: string;
  lakers_rebound: number;
  opposing_team_name: string;
  opposing_team_logo: string;
  opposing_score: number;
  home: boolean;
  start_date: string;
  seconds_elapsed: number;
  current_quarter: number;
  venue: string;
  attended: number | null;
};