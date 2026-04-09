import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import type {PlayerStat} from "./getStatsByGameId"
function FGAvsFGMGraph({ stats }: { stats: PlayerStat[]}) {
  const made = stats.reduce((sum, player) => sum + (player.field_made ?? 0),0)
  const attempted = stats.reduce((sum, player) => sum + (player.field_attempted ?? 0),0)

const chartData = [
  {
    made: made,
    attempted: attempted
  }
]
  return (
    <div className="p-8 gap-2 w-full h-[400px] flex flex-wrap justify-center items-center bg-white border border-gray-300 rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <h2>Field Goals Attempted vs. Field Goals Made</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="attempted" fill="#542581" />
          <Bar dataKey="made" fill="#FCB136" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )

  }
export default FGAvsFGMGraph