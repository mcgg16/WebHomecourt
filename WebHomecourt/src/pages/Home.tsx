import Nav from '../components/Nav'
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import MarcadorActivo, {getMarcadorActivo, type MarcadorJuego} from '../components/Home/Marcador'
import NextGame from '../components/Home/NextGame'
import GameSummaryMiniGraph from '../components/Home/MiniStats'

function Home() {
  const [juego, setJuego] = useState<MarcadorJuego | null> (null);
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
    // para no repetirlo tanto en el codigo
    const handleUpdate = async () => {
      // console.log("Cambioooo!!");
      const data = await getMarcadorActivo();
      setJuego(data);
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
        <section className="px-4 md:px-14 py-5 bg-zinc-100 w-full">
          <MarcadorActivo juego={juego}></MarcadorActivo>
          <GameSummaryMiniGraph game_id={juego.game_id}/>
        </section>
        <MarcadorActivo juego={juego}></MarcadorActivo>
      ):(
        <NextGame></NextGame>
      )}
    </div>
  )
}

export default Home
