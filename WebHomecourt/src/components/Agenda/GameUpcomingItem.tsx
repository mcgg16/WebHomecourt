import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import type { GameItem } from '../../pages/Agenda' // Has to be a type cosa estupida
import SummaryScoreCard from '../Agenda/GameScore.tsx' 
import Button from '../button.tsx'
import { TZDate } from "@date-fns/tz"; // For time zones
import { format, formatDistance, formatRelative, subDays, parseISO } from 'date-fns'; // For date formattings 

// Prop for the game item
type GameProp = {
  games: GameItem[]; 
  currentDate: Date;
}

// Will pass map of games and the current date
function GameUpcoming({ games, currentDate }: GameProp) {
  const homeBaseCSS = "flex flex-row justify-left bg-white rounded-lg outline-2 outline-gray-200 gap-5 mb-7 px-4 py-5 border-l-9 justify-center"; // To inject css for home color bar

  if (!games.length) {
    return <p>No games available for this month.</p>
  }
  return (
    <div className="grid">
      <div>
        {games.map((game) => {
          // Game is live if: current time has passed start AND game hasn't ended yet
          const parsedGameStart = parseISO(game.start_date);
          const isLive = currentDate >=  parsedGameStart && game.game_end_time === null;
          //console.log(`Game ${game.game_id} status ${isLive} parsedGameStart ${parsedGameStart} game end time ${game.game_end_time}`);

          return (
            <div key={game.game_id} className={`${homeBaseCSS} ${game.home ? "border-amarillo-oscuro" : "border-morado-lakers"}`}>
              
              {/* Left side */}

              <div className="flex flex-row flex-1 items-center">
              <img
                src={game.logo_url}
                alt={`Logo ${game.team_name}`}
                className="w-[3.75rem] max-h-[3.75rem] object-contain flex-shrink-0"
              />
              {/* Name and date */}
              <div className="flex flex-col items-start ml-3">
                <h3 className="font-black">vs {game.team_name} </h3>
                <p>{format(parseISO(game.start_date), "EEE, dd MMM· h:mm a")}</p>
              </div>
            </div>
              

              <div className="flex flex-row items-center gap-2 flex-shrink-0">
                <Button
                  text="Watch"
                  type={isLive ? 'primary' : 'primarydisable'}
                  onClick={isLive ? () => {} : () => {}}
                />
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GameUpcoming;