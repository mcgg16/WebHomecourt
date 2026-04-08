import { useEffect, useState } from 'react';
import Nav from '../components/Nav'
import Button from '../components/button.tsx'

// Get all of the games in the db, general api call

// Divide list into upcoming and past games using current date as reference to create two sublists

function Agenda() {
  const [showUpcoming, setShowUpcoming] = useState(true); // Shows upcoming default but can switch to past 

  return (
    <div className="flex flex-col items-center justify-center">
      <Nav current="Agenda" />
      <div className="px-14 py-5 bg-zinc-100 w-full">
        {/* Title comp */}
        <div className="w-full px-5 py-7 bg-violet-950 rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black/25 flex justify-between items-center overflow-hidden">
          <h1 className="justify-start text-white title1">Agenda</h1>
          <h3 className="justify-start text-white">2025 - 2026 Season</h3>
        </div>

        {/* Setup for agenda and matches list using grid */}
        <div className="grid grid-cols-6 gap-4 mt-4">
          {/* Space for agenda */}
          <div className="col-span-2 bg-gray-200 p-4">
            <p>Calendar</p>
          </div>

          {/* Side list view spanning 4 cols w buttons */}
          <div className="col-span-4 bg-gray-400 p-4">
            <div className="col-span-4">
              {/* Game type toggle, uses the showUpcoming var if true to disp as primary otherwise as secondary, and changes button state to visualize it differently */}
              <Button
                text="Upcoming Games"
                type={showUpcoming ? 'primary' : 'secondary'}
                onClick={() => setShowUpcoming(true)}
              />
              <Button
                text="Past Games"
                type={!showUpcoming ? 'primary' : 'secondary'}
                onClick={() => setShowUpcoming(false)}
              />
            </div>

            {/* Agenda list view */}

          </div>

        </div>

      </div>
    </div>
  )
}

export default Agenda
