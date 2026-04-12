import type {PlayerStat} from "./getStatsByGameId"
function PointsByPlayerGraph({ stats }: { stats: PlayerStat[]}) {
  const COLORS = [
    "#3B195C", "#542581", "#9482A5",
    "#3F2700","#8C5A08", "#FCB136", "#E7C081"] 

    return (
    <div className="w-full bg-white border border-gray-300 rounded-2xl shadow  overflow-hidden">
        <div className="bg-[#542581] text-white font-semibold grid grid-cols-10 px-4 py-3 ">
            <span className="col-span-2">PLAYER</span>
            <span>MIN</span>
            <span>PTS</span>
            <span>REB</span>
            <span>AST</span>
            <span>STL</span>
            <span>TO</span>
            <span>FGM</span>
            <span>FGA</span>
        </div>

        <div className="text-sm">
        {stats.map((player, index) => (
            <div
                key={index}
                className="grid grid-cols-10 items-center px-4 py-3"
                >
                <div className="col-span-2 flex items-center gap-2">
                    {/* placeholder de foto */}
                    <div className="w-4 h-4 rounded-full bg-[#542581]"></div> 
                    <span>{player.full_name}</span>
                </div>
                <span>{player.minutes}</span>
                <span>{player.points}</span>
                <span>{player.rebounds}</span>
                <span>{player.assists}</span>
                <span>{player.steals}</span>
                <span>{player.turnovers}</span>
                <span>{player.field_made}</span>
                <span>{player.field_attempted}</span>
            </div>
        ))}
        </div>
        <div className="bg-[#FCB136] text-black font-semibold grid grid-cols-10 px-4 py-3">
            <span className="col-span-2">Team Total</span>
            <span></span>
            <span>{stats.reduce((sum, p) => sum + p.points, 0)}</span>
            <span>{stats.reduce((sum, p) => sum + p.rebounds, 0)}</span>
            <span>{stats.reduce((sum, p) => sum + p.assists, 0)}</span>
            <span>{stats.reduce((sum, p) => sum + p.steals, 0)}</span>
            <span>{stats.reduce((sum, p) => sum + p.turnovers, 0)}</span>
            <span>{stats.reduce((sum, p) => sum + p.field_made, 0)}</span>
            <span>{stats.reduce((sum, p) => sum + p.field_attempted, 0)}</span>
        </div>
    </div>
    )
}

export default PointsByPlayerGraph