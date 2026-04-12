import { eventReports } from '../../lib/mockReports'
import EventReportRow from './EventReportRow'

const EventReports = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-6">
      <div className="bg-violet-950 px-5 py-5">
        <p className="text-white font-bold" style={{ fontSize: '26px' }}>Event Reports</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-morado-lakers text-white">
            <tr>
              <th className="px-4 py-3 text-center font-medium" style={{ fontSize: '20px' }}>Event ID</th>
              <th className="px-4 py-3 text-center font-medium" style={{ fontSize: '20px' }}>Event</th>
              <th className="px-4 py-3 text-center font-medium" style={{ fontSize: '20px' }}>Location</th>
              <th className="px-4 py-3 text-center font-medium" style={{ fontSize: '20px' }}>Host</th>
              <th className="px-4 py-3 text-center font-medium" style={{ fontSize: '20px' }}>Reports</th>
              <th className="px-4 py-3 text-center font-medium" style={{ fontSize: '20px' }}>Priority</th>
              <th className="px-4 py-3 text-center font-medium" style={{ fontSize: '20px' }}>Status</th>
              <th className="px-4 py-3 text-center font-medium" style={{ fontSize: '20px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {eventReports.map((report) => (
              <EventReportRow
                key={report.id}
                id={report.id}
                event={report.event}
                location={report.location}
                host={report.host}
                reports={report.reports}
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

export default EventReports