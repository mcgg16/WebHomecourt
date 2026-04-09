import { PieChart,Pie, Cell, Tooltip, ResponsiveContainer} from 'recharts';
import { useEffect, useState } from "react"
import { getStatsByGameId} from "./getStatsByGameId" 
import type {PlayerStat} from "./getStatsByGameId"
function PointsByPlayerGraph({ game_id }: { game_id: number }) {
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

    loadStats()
  }, [game_id])

  if (!stats.length) return <p>Loading...</p>

  const sorted = [...stats].sort((a, b) => b.points - a.points)
  const top5 = sorted.slice(0, 5)
  const rest = sorted.slice(5)
  const othersPoints = rest.reduce((sum, player) => sum + player.points, 0)
  const pieData = [
    ...top5.map(player => ({
      name: player.full_name,
      points: player.points
    })),
    ...(othersPoints > 0 ? [{ name: "Others", points: othersPoints }]: [])]

  const COLORS = [
    "#3B195C", "#542581", "#9482A5",
    "#3F2700","#8C5A08", "#FCB136", "#E7C081"] 

  return (
    <div className="p-8 w-full h-[400px] flex flex-wrap justify-center items-center drop-shadow bg-white rounded outline rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black/25">
      <h2>Points by Player</h2>
      <ResponsiveContainer>
        <PieChart>
          <Pie 
            data={pieData}
            dataKey="points"
            nameKey="name"
            outerRadius={120}
            label={({ name, percent }) =>
              `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
          >
            {pieData.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          {/* <Legend/> */}
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PointsByPlayerGraph