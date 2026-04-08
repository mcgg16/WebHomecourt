import { useNavigate } from 'react-router-dom'

// Individual item for each game
interface GameListItemProp {
  game_id: string; 
  home: boolean;
  start_date: string; 
  
}
