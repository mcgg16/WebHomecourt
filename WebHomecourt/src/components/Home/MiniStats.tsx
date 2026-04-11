import type { TeamStat } from "../Stats/getTeamStatsByGameId"
import {getTeamStatsByGameId} from "../Stats/getTeamStatsByGameId"
import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, LabelList, ResponsiveContainer,} from "recharts";

//Usando lo de amparo pero para no romper su codigo lo modificare aqui!
const MINI_STATS = [
  { key: "total_assists",   label: "Assists"   },
  { key: "total_steals",    label: "Steals"    },
  { key: "total_turnovers", label: "Turnovers" },
] as const

//NVM haré lo mio por que esta usando mal las stats LOL

function GameSummaryMiniGraph({ game_id }: { game_id: number}) {
    const [teamStats, setTeamStats] = useState<TeamStat[]>([])
    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await getTeamStatsByGameId(game_id)
                setTeamStats(data)
            } catch (err) {
                console.error(err)
            }
        } 
        loadStats()
    }, [game_id])

    const teamA = teamStats.find(t => t.team_id === 1)
    const teamB = teamStats.find(t => t.team_id !== 1)
    if (!teamA || !teamB) return null;

    return (
    <div className="w-full px-4 md:px-6 pt-6 pb-7 bg-white rounded-2xl border border-black/25 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-purple-900 text-xl md:text-3xl font-medium">
          Live Stats Summary
        </h2>
        <div className="flex items-center gap-2 text-zinc-500 text-sm md:text-lg">
          <span>View more</span>
          <span className="material-symbols-outlined  text-2xl md:text-4xl">arrow_forward</span>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        {MINI_STATS.map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-2">
            <div className="w-full h-8 rounded-2xl overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[{ teamA: teamA[key], teamB: teamB[key] }]}
                  stackOffset="expand"
                  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                >
                  <XAxis type="number" hide />
                  <YAxis type="category" hide />

                  {/* Team A */}
                  <Bar
                    dataKey="teamA"
                    stackId="a"
                    className="fill-purple-900"
                    radius={[16, 0, 0, 16]}
                  >
                    <LabelList
                      valueAccessor={() => teamA[key]}
                      position="insideLeft"
                      className="fill-white text-xs md:text-sm font-medium"
                    />
                  </Bar>

                  {/* Team B */}
                  <Bar
                    dataKey="teamB"
                    stackId="a"
                    className="fill-neutral-400"
                    radius={[0, 16, 16, 0]}
                  >
                    <LabelList
                      valueAccessor={() => teamB[key]}
                      position="insideRight"
                      className="fill-purple-900 text-xs md:text-sm font-medium"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-violet-950 text-base md:text-lg">
              {label}
            </p>
          </div>
        ))}
        <div className="flex justify-between pt-2">
          <span className="text-violet-950 text-lg md:text-2xl">LA</span>
          <span className="text-violet-950 text-lg md:text-2xl">GSW</span>
        </div>
      </div>
    </div>
  )
}
export default GameSummaryMiniGraph;
import { supabase } from "../../lib/supabase"
import { useEffect, useState } from "react"

export type MarcadorJuego = {
  game_id: number;
  lakers_name: string;
  lakers_rebound: number;
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
