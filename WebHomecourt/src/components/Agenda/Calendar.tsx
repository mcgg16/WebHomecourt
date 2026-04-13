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

    //const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    //const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    // Map game by local calendar day number
    /*
    const gamesByDateKey = new Map<string, GameItem>();
    for (const game of games) {
        const gameDate = new Date(game.start_date);
        const key = format(gameDate, "yyyy-MM-dd");
        gamesByDateKey.set(key, game);
    }
    */

    return (
        <div className="p-5">
            {/* Header month and arrows */}
            <div className="flex items-center justify-between">
                <h4 className="text-morado-lakers mb-1">{format(agendaDate, "MMMM yyyy")}</h4>
            </div>

            {/* Grid 6 rows 7 cols to have days and then the dates always working */}
            <div className="grid grid-cols-7">
                {WEEKDAYS.map((day) => {
                    return <div key={day} className="mt-2 font-semibold border">{day}</div>; // Can give days as key because none of the days repeat
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

                {/* Render days in month, give key */}
                {daysInMonth.map((day) => {
                    return <div className="p-3.5 outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex flex-col justify-center items-center">{format(day, "d")}</div>;
                })}

                {/* Map to skip dates and compensate for month starting on a day that isn't Sunday 
                {Array.from({ length: endingDayIndex }).map((_, index) => {
                    return (
                        <div
                            key={`empty-${index}`}
                            className="p-3.5 bg-gray-100 outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex flex-col"
                        />
                    );
                })}
                */}
            </div>

        </div>
    );
}

export default AgendaCalendar;