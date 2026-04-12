import { adminStats } from '../../lib/mockReports'

const stats = [
  { label: 'Reports Pending', value: adminStats.reportsPending, icon: 'assignment' },
  { label: 'Users Flagged',   value: adminStats.usersFlagged, icon: 'person_alert' },
  { label: 'Events Flagged',  value: adminStats.eventsFlagged, icon: 'flag' },
  { label: 'Suspended Users', value: adminStats.suspendedUsers, icon: 'account_circle_off' },
]

const StatsCards = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-200 flex flex-col items-center">
          <h2 className="text-sm font-medium text-black text-center" style={{ fontSize: '20px' }} >{s.label}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="material-symbols-outlined text-yellow-500" style={{ fontSize: '48px' }}>{s.icon}</span>
            <p className="title2 text-black" style={{ fontSize: '50px' }}>{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
export default StatsCards