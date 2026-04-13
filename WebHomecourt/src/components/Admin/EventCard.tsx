const statusStyles: Record<string, string> = {
  Active: 'bg-[#28924F]/26 text-[#083C1B]',
  New:    'bg-[#FCB136]/49 text-[#4E3204]',
}

interface EventCardProps {
  id: number
  name: string
  status: string
  host: string
  location: string
  players: number
}

const EventCard = ({ name, status, host, location, players }: EventCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
      
      <div className="flex justify-between items-center">
        <h2 className="text-black" style={{ fontSize: '26px' }}>{name}</h2>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusStyles[status]}`}>
          {status}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden" />
        <p className="font-medium">{host}</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-gray-500" style={{ fontSize: '18px' }}>location_on</span>
            <p>{location}</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-gray-500" style={{ fontSize: '18px' }}>groups</span>
            <p>{players}</p>
          </div>
        </div>

        <button className="bg-morado-lakers text-white px-5 py-2 rounded-lg font-medium hover:bg-morado-oscuro transition-colors">
          Monitor
        </button>
      </div>

    </div>
  )
}

export default EventCard