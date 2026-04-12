import { reportDetails } from '../../lib/mockReports'
import HistoryCard from './HistoryCard'
import StarRating from './StarRating'


const UserHistory = () => {
  return (
    <div className="bg-[#000000]/5 w-full md:w-84 flex flex-col gap-4 self-stretch p-4 -mb-10">

      <div>
        <h1 className="font-medium mb-4 pb-2 pt-1" style={{ fontSize: '20px' }}>Reported User</h1>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
            <img src={`https://i.pravatar.cc/150?u=${reportDetails.reportedUser.name}`} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-medium" style={{ fontSize: '18px' }}>{reportDetails.reportedUser.name}</h2>
            <StarRating rating={reportDetails.reportedUser.rating} />
          </div>
        </div>
        <p className="text-gray-500 font-medium text-sm pb-4" style={{ fontSize: '14px' }}>{reportDetails.reportedUser.totalReports} reports | Avg. Rating {reportDetails.reportedUser.rating}</p>
        <button className="mt-3 w-full bg-morado-lakers text-white py-1.5 rounded-lg font-medium hover:bg-morado-oscuro transition-colors" style={{ fontSize: '14px' }}>
          View Profile
        </button>
      </div>

      <p className="font-medium pt-6 px-1" style={{ fontSize: '20px' }}>History</p>
      <div className="flex flex-col gap-3">
        {reportDetails.history.map((h, i) => (
          <HistoryCard
            key={i}
            event={h.event}
            date={h.date}
            rating={h.rating}
            tags={h.tags}
          />
        ))}
      </div>

    </div>
  )
}

export default UserHistory