import { supabase } from "../../lib/supabase"

//Estructura de datos que obtiene de vista
export type MarcadorJuego = {
  game_id: number;
  lakers_name: string;
  lakers_logo: string;
  lakers_score: number;
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

export async function getMarcadorActivo(): Promise<MarcadorJuego>{
    //CONEXION A SUPABASE
    const {data, error} = await supabase
        .schema("simulacion_juego")    
        .from("v_marcador_activo")
        .select("*")
        .single();
    // POR SI ALGO MUERE
    if (error) {
        console.error("Supabase error:", error.message)
        throw new Error("Failed to get MARCADOR")
    }
    //Regresa los datos
    return data
}

//Componente de marcador
function MarcadorActivo(){
    return(
        <div>

        </div>
    )
}

export default MarcadorActivo