import { useNavigate } from 'react-router-dom'
import type { GameItem } from '../../pages/Agenda' // Has to be a type cosa estupida
import SummaryScoreCard from '../Agenda/GameScore.tsx' 
import Button from '../button.tsx'

// Prop for the game item
type GameProp = {
  games: GameItem[]; 
}

/*
function GameListItem({ games }: GameProp) {
  return (
        <div>
            {games.map(game => (
                <div
                    key={game.game_id}
                    className="bg-white rounded-md justify-center text-center px-2 py-3 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[14.625rem] min-h-[20.5rem]">
                    <h1 className="text-lg font-black ">{game.opposing_team_id}</h1>
                    <img src={game.logo_url} alt="Opposite team" className="w-[10.75rem] max-h-[14.25rem] mx-auto" />
                    <p>Lakers: ${game.lakers_score}</p>
                    <p>Opposing: {game.opposite_score}</p>
                </div>
            ))}
        </div>
    )
}; */

/*
function GameListItem({ games }: GameProp) {
  if (!games.length) {
    return <p>No games available for this month.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-5 font-['Graphik']">
      {games.map(game => (
        <div
          key={game.game_id}
          className="bg-white rounded-md justify-center text-center px-2 py-3 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[14.625rem] min-h-[20.5rem]">
          <h1 className="text-lg font-black ">
            {game.home ? "Home" : "Away"} vs Team {game.opposing_team_id}
          </h1>
          <img src={game.logo_url} alt="Team Logo" className="w-[10.75rem] max-h-[14.25rem] mx-auto" />
          <p>Date: {new Date(game.start_date).toLocaleString()}</p>
          <p>Score: {game.lakers_score} - {game.opposite_score}</p>
        </div>
      ))}
    </div>
  );
}*/

function GameListItem({ games }: GameProp) {
  if (!games.length) {
    return <p>No games available for this month.</p>
  }
  
  // Add logic to custom the css class name for home or away like just to keep border-color based on whether it's home or away

  return (
    <div className="grid">
      <div>
        {games.map(game => (
          <div key={game.game_id} className="flex flex-row justify-left bg-white rounded-lg outline-2 outline-gray-200 gap-5 mb-7 px-4 py-5 border-l-9 border-morado-lakers">
            <img
              src={game.logo_url}
              alt={`Logo ${game.team_name}`}
              className="w-[3.75rem] max-h-[3.75rem] mx-auto col-span-1"
            />

            {/* Name and date */}
            <div>
              <h3 className="font-black">vs {game.team_name} </h3>
              <p>{game.start_date}</p>
            </div>

            {/* Show whether won or lost */}
            <SummaryScoreCard lakers_score={game.lakers_score} opposite_score={game.opposite_score} />

            <Button
              text="Recap"
              type="primary"
              onClick={() => {}} // Update to use redirect 
              //className="w-full"
            />

          </div>
        ))}
      </div>

      
    </div>
  )
}

export default GameListItem;