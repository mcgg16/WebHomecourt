import Nav from '../components/Nav'
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import RealtimeChat from '../components/RealtimeChat'
import SignInButton from '../components/botongoogle'
function Home() {

  
    useEffect(() => {
      const loadUser = async () => {
        
      }
  
      loadUser()

      const channel = supabase
        .channel('realtime_marcador_home')
        .on(
          'postgres_changes',
          { event: '*', schema: 'simulacion_juego', table: 'team_player_stats' },
          () => {
            loadUser()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }, [])

  return (
    <div>
      
      
    </div>
  )
}

export default Home
