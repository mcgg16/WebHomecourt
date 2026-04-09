import Nav from '../components/Nav'
import PointsByPlayerGraph from '../components/Stats/PointsByPlayerGraph';
import FGAvsFGMGraph from '../components/Stats/FGAvsFGMGraph';
import { useEffect, useState } from "react"
import { getStatsByGameId} from "../components/Stats/getStatsByGameId" 
import type {PlayerStat} from "../components/Stats/getStatsByGameId"

function Estadisticas({ game_id }: { game_id: number }) {
  //function Estadisticas(){
  const [stats, setStats] = useState<PlayerStat[]>([])
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getStatsByGameId(game_id)
        setStats(data)
      } catch (err) {
        console.error(err)
      }
    }
  loadStats()}, [game_id])

  if (!stats) return <p>Loading...</p>
  if (stats.length === 0) return <p>No data</p>

  return (
    <div className="flex flex-col items-center justify-center">
      <Nav current="Estadistica" />
      <div className='px-14 py-5 bg-zinc-100 w-full'>
        <div className="w-full px-5 py-7 bg-violet-950 rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] inline-flex flex-col justify-start items-start">
          <div className="justify-start text-zinc-100 text-4xl font-black font-['Graphik']">Statistics</div>
          
        </div>
        <div className='flex gap-6 p-6 '>
          <PointsByPlayerGraph stats={stats} />
          <FGAvsFGMGraph stats={stats} />
          
        </div>
      </div>
    </div>
  )
}

export default Estadisticas
