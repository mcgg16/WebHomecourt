import { activeEvents } from '../../lib/mockReports'
import EventCard from './EventCard'

const ActiveEvents= () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-6">
      <div className="bg-violet-950 px-5 py-5">
        <p className="text-white font-bold" style={{ fontSize: '26px' }}>Active and Newly Created Events</p>
      </div>

      <div className="bg-morado-lakers grid grid-cols-1 md:grid-cols-3 gap-10 px-10 pb-7 pt-7">
        {activeEvents.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            name={event.name}
            status={event.status}
            host={event.host}
            location={event.location}
            players={event.players}
          />
        ))}
      </div>
    </div>
  )
}

export default ActiveEvents