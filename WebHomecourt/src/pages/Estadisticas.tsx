import Nav from '../components/Nav'
import PointsByPlayerGraph from '../components/Stats/PointsByPlayerGraph';
import FGAvsFGMGraph from '../components/Stats/FGAvsFGMGraph';
import RatioGraph from '../components/Stats/RatioGraph';
import { useEffect, useState } from "react"
import { getStatsByGameId} from "../components/Stats/getStatsByGameId" 
import type {PlayerStat} from "../components/Stats/getStatsByGameId"
import GameSummaryGraph from '../components/Stats/GameSummaryGraph';
import PlayerStatsTable from '../components/Stats/PlayerStatsTable';

function Estadisticas({ game_id }: { game_id: number }) {
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
  return (
    <div className="flex flex-col items-center justify-center  ">
      <Nav current="Estadistica" />
      <div className='px-14 py-5 bg-zinc-100 w-full '>
        <div className="w-full px-5 py-7 bg-violet-950 rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black/25 inline-flex flex-col justify-start items-start gap-3.5 overflow-hidden">
          <div className="justify-start text-zinc-100 text-4xl font-black font-['Graphik']">Statistics</div>
        </div>
        <div></div>
        <div className='flex gap-6 pt-6 '>
          <PointsByPlayerGraph stats={stats} />
          <GameSummaryGraph game_id={game_id}/>
         
        </div>
        <div className='flex gap-6 pt-6 '>
          <div className = 'width="30%"'>
            <FGAvsFGMGraph stats={stats} />
          </div>
          <RatioGraph stats={stats} />
        </div>
        <div className='flex center gap-6 pt-6 '>
          <PlayerStatsTable stats={stats} />
        </div>
      </div>
    </div>
  )
}

export default Estadisticas
