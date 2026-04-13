import { supabase } from "../../lib/supabase"
import { useEffect, useState } from "react"
import { format } from "date-fns";

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

export async function getMarcadorActivo(): Promise<MarcadorJuego | null>{
    //CONEXION A SUPABASE
    const {data, error} = await supabase
        .schema("simulacion_juego")    
        .from("v_marcador_activo")
        .select("*")
        .order("start_date", { ascending: false })
        .limit(1)
        .maybeSingle();
    // POR SI ALGO MUERE
    if (error) {
        console.error("Supabase error:", error.message)
        throw new Error("Failed to get MARCADOR")
    }
    //Regresa los datos
    return data
}

export function ContadorTiempo(startDate: string): number {
  return Math.floor((Date.now() - new Date(startDate).getTime()) / 1000);
}

//MAYBE ESTO DESPUES LO PASO A UNA CARPETA DE HOOKS
//Contadorsss o cronometro del partido a partir la fecha de inicio
export const useContadorTiempo = (startDate?: string) => {
  const [segundos, setSegundos] = useState(
    startDate ? ContadorTiempo(startDate) : 0
  );

  useEffect(() => {
    if (!startDate) {
      setSegundos(0);
      return;
    }

    setSegundos(ContadorTiempo(startDate));

    const intervalo = setInterval(() => {
      setSegundos(ContadorTiempo(startDate));
    }, 1000);

    return () => clearInterval(intervalo);
  }, [startDate]);

  return segundos;
};

type MarcadorActivoProps = {
  juego: MarcadorJuego;
};

//Componente de marcador
function MarcadorActivo({juego}:MarcadorActivoProps){

  const segundos = useContadorTiempo(juego?.start_date);

    return(
        <section className="px-4 md:px-14 py-5 bg-zinc-100 w-full">
          <article className="w-full px-5 py-7 bg-purple-900 rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black/25 flex flex-col justify-start items-start gap-3.5 overflow-hidden">
            <header className="self-stretch flex justify-between items-center">
              <div className="flex justify-start items-center gap-4 md:gap-7">
                <div className="px-3 md:px-5 py-2 md:py-3 bg-red-500 rounded-2xl flex justify-center items-center gap-2.5">
                  <span className="material-symbols-outlined text-zinc-100 text-2xl md:text-4xl">motion_photos_on</span>
                </div>
                <h1 className="hidden md:block text-zinc-100 title1">Live game</h1>
              </div>
              <h3 className="text-white text-sm md:text-base">
                {format(new Date(juego.start_date), "MMMM do, yyyy")}
              </h3>
            </header>
            <div className="self-stretch px-2.5 py-5 md:py-7 bg-white rounded-2xl flex flex-col justify-center items-center gap-4 md:gap-5 overflow-hidden">
              <div className="flex justify-center items-center gap-4 md:gap-12">
                <div className="flex flex-col justify-center items-center gap-1">
                  <img className="h-16 md:h-20 w-auto object-contain" src={juego?.lakers_logo} />
                  <h3 className="hidden md:block text-xs md:text-base text-center">{juego?.lakers_name}</h3>
                  <p className="hidden md:block text-xs md:text-sm text-gray-500">{juego?.home ? "Home" : "Visitor"}</p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <span className="text-violet-950 text-sm md:text-4xl font-medium marcador whitespace-nowrap">
                    {juego?.lakers_score} – {juego?.opposing_score}
                  </span>
                </div>
                <div className="flex flex-col justify-center items-center gap-1">
                  <img className="h-16 md:h-20 w-auto object-contain" src={juego?.opposing_team_logo}/>
                  <h3 className="hidden md:block text-xs md:text-base text-center">{juego?.opposing_team_name}</h3>
                  <p className="hidden md:block text-xs md:text-sm text-gray-500">{juego?.home ? "Visitor" : "Home"}</p>
                </div>
              </div>
              <hr className="w-full h-0.5 bg-yellow-700" />
              <div className="w-full flex justify-between items-center px-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-violet-950 text-base">history</span>
                  <p className="text-violet-950 text-xs md:text-sm">{segundos} elapsed</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-violet-950 text-base">location_on</span>
                  <p className="text-violet-950 text-xs md:text-sm">{juego?.venue ?? "Not found"}</p>
                </div>
                <div className="hidden md:flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-violet-950 text-base">group</span>
                  <p className="text-violet-950 text-sm">
                    {juego?.attended != null ? Number(juego?.attended).toLocaleString('en-US') : '0'} attended
                  </p>
                </div>
              </div>
            </div>
          </article>
        </section>  
    )
}

export default MarcadorActivo