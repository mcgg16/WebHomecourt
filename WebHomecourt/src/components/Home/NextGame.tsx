import { supabase } from "../../lib/supabase"
import { useEffect, useState } from "react"
import { format } from "date-fns";

//Estructura de datos que obtiene de vista
export type ProximoJuego = {
  game_id: number;
  opposing_team_name: string;
  opposing_team_logo: string;
  start_date: string;
};

export async function getProximoJuego(): Promise<ProximoJuego | null>{
    //CONEXION A SUPABASE
    const {data, error} = await supabase
        .schema("simulacion_juego")    
        .from("v_prox_juego")
        .select("*")
        .single();
    // POR SI ALGO MUERE
    if (error) {
        console.error("Supabase error:", error.message)
        throw new Error("Failed to get next game")
    }
    //Regresa los datos
    return data
}

export function CalcularSegundos(startDate?: string): number {
    const now = new Date().getTime();
    if (!startDate) return 0;
    const start = new Date(startDate).getTime();
    return Math.max(Math.floor((start - now) / 1000), 0);
}

export const useTemporizador = (startDate?: string) =>{
    const [segundos, setSegundos] = useState(CalcularSegundos(startDate));

    useEffect(() =>{
        const intervalo = setInterval(() => {
            setSegundos(CalcularSegundos(startDate));
        }, 1000);
        return () => clearInterval(intervalo);
    }, [startDate]);
    return segundos;
};

//Maybe cambiarlo a dias, horas, min, seg
const formatTime = (seg: number) => {
  const d = Math.floor(seg / 86400);
  const h = Math.floor((seg % 86400) / 3600);
  const m = Math.floor((seg % 3600) / 60);
    const s = seg % 60;

  if (d > 0) {
    return `${d.toString().padStart(2,"0")}:${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
  }

  return `${Math.floor(seg / 3600).toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
};

function NextGame(){
    const [juego, setJuego] = useState<ProximoJuego | null> (null);
    const segundos = useTemporizador(juego?.start_date);
    const mostrarDias = segundos >= 86400;

    useEffect(() => {
        const fetchJuego = async () =>{
            try {
                const data = await getProximoJuego();
                setJuego(data);
            } catch (error) {
                console.error("Error loading marcador:", error)
                setJuego(null)
            }
        };
        fetchJuego();
    }, [])

    if(!juego) return null

    return(

          <article className="w-full px-4 md:px-5 py-5 bg-purple-900 rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black/25 flex flex-col justify-start items-start gap-3 overflow-hidden">
            <header className="self-stretch flex justify-between items-center">
              <div className="flex justify-start items-center gap-3 md:gap-5">
                <h1 className="hidden md:block text-zinc-100 title1">Next game</h1>
              </div>
              <h3 className="text-white text-xs md:text-sm">
                {format(new Date(juego.start_date), "MMMM do, yyyy")}
              </h3>
            </header>
            <div className="self-stretch px-2 py-4 md:py-5 bg-white rounded-2xl flex flex-col justify-center items-center gap-3 md:gap-4 overflow-hidden">
              <div className="px-2.5 md:px-4 py-4 md:py-5 bg-white rounded-2xl flex flex-col items-center gap-4">
                <div className="flex flex-col md:flex-row items-center gap-3 md:gap-7 text-center">
                    <img className="w-10 h-10 md:w-14 md:h-14 object-contain" src={juego.opposing_team_logo}/>
                    <h2 className="text-violet-950 text-base md:text-xl font-medium"> vs {juego.opposing_team_name} </h2>
                </div>
                <div className="text-violet-950 text-3xl md:text-6xl font-black tracking-wider">
                    {formatTime(segundos)}
                </div>
                <p className="text-violet-950 text-[10px] md:text-sm">
                    {mostrarDias ? "Days : Hours : Minutes : Seconds" : "Hours : Minutes : Seconds"}
                </p>
              </div>
            </div>
          </article>
    )
}

export default NextGame