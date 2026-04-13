import type { GameItem } from '../../pages/Agenda' // Has to be a type cosa estupida
import {
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    isSameMonth,
    isToday,
    getDay,
    lastDayOfMonth,
} from "date-fns";

// Data that will be passed, note that when month changes it'll pass the new date and that'll be handled by Agenda area w funct call
type CalendarProp = {
    agendaDate: Date; // Current or selected date, depends on what is passed to component
    games: GameItem[];
    onChangeMonth: (newDate: Date) => void;
}

// Basado en https://www.youtube.com/watch?v=RWz23UKXdAk 
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Agenda calendar itself
function AgendaCalendar({ agendaDate, games, onChangeMonth }: CalendarProp) {
    // To form array from start to end of month
    const firstDayMonth = startOfMonth(agendaDate); // First day of month
    const lastDayMonth = endOfMonth(agendaDate); // Last day of month 

    const daysInMonth = eachDayOfInterval({
        start: firstDayMonth,
        end: lastDayMonth,
    });

    // Get first day of month to show correct date w starting index
    const startingDayIndex = getDay(firstDayMonth); // Checks curr day of month
    const endingDayIndex = getDay(lastDayMonth);

    // Map game to this calendar day number "date": GameItem
    const gamesByDateKey = new Map<string, GameItem>();

    for (const game of games) {
        const gameDate = new Date(game.start_date);
        const key = format(gameDate, "yyyy-MM-dd");
        gamesByDateKey.set(key, game); // Maps the key date to the game, so that way i reconstruct the calendar
        //console.log(`Mapped ${key} with ${game.game_id} on ${game.start_date}`)
    }

    return (
        <div className="p-5">
            {/* Header month and arrows */}
            <div className="flex items-center justify-between">
                <h4 className="text-morado-lakers mb-1">{format(agendaDate, "MMMM yyyy")}</h4>

                <div className="flex gap-5 text-2xl text-morado-lakers">
                    <button onClick={() => onChangeMonth(subMonths(agendaDate, 1))} className="hover:underline hover:text-morado-bajo hover:font-semibold">&lt;</button>
                    <button onClick={() => onChangeMonth(addMonths(agendaDate, 1))} className="hover:underline hover:text-morado-bajo hover:font-semibold">&gt;</button>
                </div>
            </div>

            {/* Grid 6 rows 7 cols to have days and then the dates always working */}
            <div className="grid grid-cols-7">
                {WEEKDAYS.map((day) => {
                    return <div key={day} className="mt-2 font-semibold">{day}</div>; // Can give days as key because none of the days repeat
                })}

                {/* Map to skip dates and compensate for month starting on a day that isn't Sunday, giving empty to avoid repeating index as below */}
                {Array.from({ length: startingDayIndex }).map((_, index) => {
                    return (
                        <div
                            key={`empty-${index}`}
                            className="p-3.5 bg-gray-100 outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex flex-col"
                        />
                    );
                })}

                {/* Render days in month, give key {games.filter((game) => isSameDay(game.start_date, day).map(game.game_id))} */}
                {daysInMonth.map((day) => {
                    // To show the games based on dictionary
                    const dateKey = format(day, "yyyy-MM-dd");
                    const game = gamesByDateKey.get(dateKey); 
                    const inCurrentMonth = isSameMonth(day, agendaDate); // Stores whether numeric day corresponds to month so that it only highlights the date if it's actually the same day y no nomas el 12 highlighted accross every month lol

                    // Construct cell styled fashion depending on event type 
                    let cellStyle = "p-3.5 outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex flex-col justify-center items-center"

                    // Check if game is home or not 
                    if (game?.home) {
                        cellStyle += " bg-amarillo-oscuro text-white";
                    } else if (game && !game.home) {
                        cellStyle += " bg-morado-oscuro text-white"
                    }

                    // Show current date
                    if (isToday(day) && inCurrentMonth) {
                        cellStyle += " bg-morado-bajo"
                    }

                    return (
                        <div className={cellStyle}>
                            {format(day, "d")}
                        </div>
                    );
                })}

                {/* Map to color remaining cells gray so if the day ends on day 4 aka thursday does 6-4=2 cells to color in remaining */}
                {Array.from({ length:(6-endingDayIndex) }).map((_, index) => {
                    return (
                        <div
                            key={`empty-${index}`}
                            className="p-3.5 bg-gray-100 outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex flex-col"
                        />
                    );
                })}
                
            </div>

            {/* Legend w dates and such */}
            <div className="mt-4 flex flex-col gap-2">
                {/* Home */ }
                <div className="inline-flex justify-start items-start gap-2.5 overflow-hidden">
                    <div className="w-5 h-5 bg-amarillo-oscuro"></div>
                    <div className="text-center justify-center text-black">Home</div>
                </div>
                {/* Away */ }
                <div className="inline-flex justify-start items-start gap-2.5 overflow-hidden">
                    <div className="w-5 h-5 bg-morado-oscuro"></div>
                    <div className="text-center justify-center text-black">Away</div>
                </div>
            </div>

        </div>
    );
}

export default AgendaCalendar;