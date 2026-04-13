import { useEffect, useState } from 'react'
import { getActiveEvents } from '../../pages/Admin'
import EventCard from './EventCard'

const ActiveEvents= () => {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getActiveEvents()
      setEvents(data)
    }
    fetchEvents()
  }, [])

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-6">
      <div className="bg-violet-950 px-5 py-5">
        <p className="text-white font-bold" style={{ fontSize: '26px' }}>Active and Newly Created Events</p>
      </div>
      <div className="bg-morado-lakers grid grid-cols-1 md:grid-cols-3 gap-10 px-10 pb-7 pt-7">
        {events.map((event) => (
          <EventCard
            key={event.event_id}
            id={event.event_id}
            name={event.event_name}
            status={event.allow_event ? 'Active' : 'New'}
            host={event.created_user?.username ?? 'N/A'}
            location={event.court?.name ?? 'N/A'}
            players={event.max_players}
          />
        ))}
      </div>
    </div>
  )
}

export default ActiveEvents