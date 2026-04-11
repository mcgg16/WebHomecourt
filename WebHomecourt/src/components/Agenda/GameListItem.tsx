import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import type { GameItem } from '../../pages/Agenda' // Has to be a type cosa estupida
import SummaryScoreCard from '../Agenda/GameScore.tsx' 
import Button from '../button.tsx'
import { format, formatDistance, formatRelative, subDays, parseISO } from 'date-fns' // For date formattings 

// Prop for the game item
type GameProp = {
  games: GameItem[]; 
}

function GameListItem({ games }: GameProp) {
  const homeBaseCSS = "flex flex-row justify-left bg-white rounded-lg outline-2 outline-gray-200 gap-5 mb-7 px-4 py-5 border-l-9 justify-center"; // To inject css for home color bar

  if (!games.length) {
    return <p>No games available for this month.</p>
  }

  return (
    <div className="grid">
      <div>
        {games.map(game => (
          <div key={game.game_id} className={`${homeBaseCSS} ${game.home? "border-amarillo-oscuro" : "border-morado-lakers" }`}>
            {/* Left side logo and team name */}
            <div className="flex flex-row flex-1 items-center">
              <img
                src={game.logo_url}
                alt={`Logo ${game.team_name}`}
                className="w-[3.75rem] max-h-[3.75rem] object-contain flex-shrink-0"
              />
              {/* Name and date */}
              <div className="flex flex-col items-start ml-3">
                <h3 className="font-black">vs {game.team_name} </h3>
                <p>{format(parseISO(game.start_date), "EEE, dd MMM")}</p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex flex-row items-center gap-2 flex-shrink-0">
              {/* Show whether won or lost */}
              <SummaryScoreCard lakers_score={game.lakers_score} opposite_score={game.opposite_score}/>

              <Button
                text="Recap"
                type="primary"
                onClick={() => {}} // Update to use redirect 
                className="ml-5"
              />
            </div>

            

          </div>
        ))}
      </div>

      
    </div>
  )
}

export default GameListItem;