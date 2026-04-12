import { userReports } from '../../lib/mockReports'
import { useNavigate } from 'react-router-dom'
import UserReportRow from './UserReportRow'

const UserReportsTable = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-6">
      <div className="bg-violet-950 px-5 py-5">
        <p className="text-white font-bold" style={{ fontSize: '26px' }}>User Reports</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-morado-lakers text-white">
            <tr>
              <th className="px-4 py-3 text-center font-medium" style={{ fontSize: '20px' }}>Report ID</th>
              <th className="px-4 py-3 text-center font-medium" style={{ fontSize: '20px' }}>Event</th>
              <th className="px-4 py-3 text-center font-medium" style={{ fontSize: '20px' }}>Reported User</th>
              <th className="px-4 py-3 text-center font-medium" style={{ fontSize: '20px' }}>Priority</th>
              <th className="px-4 py-3 text-center font-medium" style={{ fontSize: '20px' }}>Status</th>
              <th className="px-4 py-3 text-center font-medium" style={{ fontSize: '20px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userReports.map((report) => (
              <UserReportRow
                key={report.id}
                id={report.id}
                event={report.event}
                reportedUser={report.reportedUser}
                priority={report.priority}
                status={report.status}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserReportsTable