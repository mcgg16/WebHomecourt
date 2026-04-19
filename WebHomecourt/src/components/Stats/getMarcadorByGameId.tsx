import type {MarcadorJuego} from '../Home/Marcador'
import { supabase } from "../../lib/supabase"

export async function getMarcadorByGameId(game_id: number): Promise<MarcadorJuego>{
    const {data, error} = await supabase
        .schema("simulacion_juego")    
        .from("view_marcadores")
        .select("*")
        .eq("game_id", game_id)
        .single();
    if (error) {
        console.error("Supabase error:", error.message)
        throw new Error("Failed to get MARCADOR")
    }
    return data
}
