import { useEffect, useState } from 'react';

// Simple componet to show w Game list item w numbers and color
export interface SummaryScoreProp {
    lakers_score: number,
    opposite_score: number
}

export function SummaryScoreCard(prop: SummaryScoreProp) {
    const [winStatus, setWinStatus] = useState(true);

    // When loads, checks if they lost
    useEffect(() => {
        if (prop.lakers_score < prop.opposite_score) {
            setWinStatus(false); 
        }
    }); 

    // Checks status and shows color coded
    return (
        <div className="w-auto md:w-[5rem] text-center text-lg flex justify-center items-center ">
            {winStatus ? <div className="bg-green-100 text-green-800 outline-2 outline-green-800 rounded-lg px-3 py-1 whitespace-nowrap">{prop.lakers_score} - {prop.opposite_score}</div> : <div className="bg-red-100 text-red-800 outline-2 outline-red-800 rounded-lg px-3 py-1 whitespace-nowrap">{prop.lakers_score} - {prop.opposite_score}</div>}
        </div>
    );
}

export default SummaryScoreCard;