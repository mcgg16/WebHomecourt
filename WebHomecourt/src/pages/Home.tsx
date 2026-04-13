import Nav from '../components/Nav'
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import MarcadorActivo, {getMarcadorActivo, type MarcadorJuego} from '../components/Home/Marcador'
import NextGame from '../components/Home/NextGame'
import GameSummaryMiniGraph from '../components/Home/MiniStats'

//Obtener el id del ultimo partido
export async function getPastGameId(): Promise<number> {
  const { data, error } = await supabase.rpc("get_last_game_id", {}) 
  // Smth died
  if (error) {
    console.error("Supabase error:", error.message)
    throw new Error("Failed to get ministats")
  }

  return data
}

function Home() {
  const [juego, setJuego] = useState<MarcadorJuego | null> (null);
  const [pastgame, setPastGame] = useState<number | null> (null);
  const [miniStatsRefreshKey, setMiniStatsRefreshKey] = useState(0);
  useEffect(() => {
    const fetchJuego = async () =>{
        try {
            const data = await getMarcadorActivo();
            setJuego(data);
        } catch (error) {
            console.error("Error loading marcador:", error)
            setJuego(null)
        }
    };
    fetchJuego();
    // Obtener el ultimo id
    const fetchLastFameId = async() => {
       try {
            const data = await getPastGameId();
            setPastGame(data);
        } catch (error) {
            console.error("Error loading marcador:", error)
            setPastGame(null)
        }
    };
    fetchLastFameId();
    // para no repetirlo tanto en el codigo
    const handleUpdate = async () => {
      // console.log("Cambioooo!!");
      const data = await getMarcadorActivo();
      setJuego(data);
      setMiniStatsRefreshKey((prev) => prev + 1);
    };
    //Canal para actualizar view cuando se detecte un cambio en update
    const channel = supabase
    .channel("marcador-live")
    .on(
      "postgres_changes",
      {event: "UPDATE", schema: "simulacion_juego", table: "team_player_stats"},
      handleUpdate
    )
    .on(
      "postgres_changes",
      {event: "UPDATE", schema: "simulacion_juego", table: "game"},
      handleUpdate
    )
    .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [])
  return (
    <div>
      <Nav current='Home'></Nav>
      {juego ? (
        <section className="px-4 md:px-14 py-5 bg-zinc-100 w-full flex flex-col gap-6">
          <MarcadorActivo juego={juego} />
          <GameSummaryMiniGraph game_id={juego.game_id} refreshKey={miniStatsRefreshKey} pastGame={false}/>
        </section>
      ):(
        <section className="px-4 md:px-14 py-5 bg-zinc-100 w-full flex flex-col gap-6">
          <NextGame></NextGame>
          {pastgame !== null ? (
            <GameSummaryMiniGraph game_id={pastgame} refreshKey={miniStatsRefreshKey} pastGame={true}/>
          ) : null}
        </section>
      )}
    </div>
  )
}

export default Home