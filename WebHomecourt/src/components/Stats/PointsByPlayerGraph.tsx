import { PieChart,Pie, Cell, Tooltip, ResponsiveContainer} from 'recharts';
import type {PlayerStat} from "./getStatsByGameId"
function PointsByPlayerGraph({ stats }: { stats: PlayerStat[]}) {
  

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
    <div className="p-8 w-full h-[350px] flex flex-wrap justify-center items-center bg-white border border-gray-300 rounded-2xl shadow">
      <h2>Points by Player</h2>
      <ResponsiveContainer>
        <PieChart>
          <Pie 
            data={pieData}
            dataKey="points"
            nameKey="name"
            outerRadius="80%"
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
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PointsByPlayerGraph