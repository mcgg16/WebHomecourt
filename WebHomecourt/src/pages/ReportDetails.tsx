import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import { reportDetails } from '../lib/mockReports'
import UserHistory from '../components/ReportDetails/UserHistory'
import ActionButtons from '../components/ReportDetails/ActionButtons'


const ReportDetails = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-zinc-100">
      <Nav current="Admin" />

      <div className="px-4 md:px-14 py-5 mb-10">
        {/* Header */}
        <div className="w-full px-5 py-7 bg-violet-950 rounded-2xl flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-white" style={{ fontSize: '36px' }}>admin_panel_settings</span>
          <h1 className="text-white title1">Reports Administration</h1>
        </div>

        {/* Report Details Card */}
        <div className="bg-white rounded-xl border border-gray-300 overflow-hidden">
          
          {/* Card Header */}
          <div className="bg-violet-950 px-5 py-4 flex justify-between items-center">
            <p className="text-white font-bold" style={{ fontSize: '26px' }}>Report Details</p>
            <button onClick={() => navigate('/admin')}
              className="text-white hover:text-gray-300 transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>close</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-10">
            
            {/* Left side */}
            <div className="flex-1 flex flex-col gap-6 p-6 ">
              
              <h2 className="font-bold text-black"  style={{ fontSize: '27px' }}>Event: {reportDetails.event}</h2>

              <div className="flex flex-wrap gap-25">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-black" style={{ fontSize: '18px' }}>location_on</span>
                  <p>Location: {reportDetails.location}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-black" style={{ fontSize: '18px' }}>groups</span>
                  <p>Participants: {reportDetails.participants}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-black" style={{ fontSize: '18px' }}>calendar_today</span>
                <p>Date: {reportDetails.date}</p>
              </div>

              <hr className="border-amarillo-lakers border-t-2 my-4  -mx-12" />


              {/* Report Comment */}

              <h2 className="font-medium text-black" style={{ fontSize: '20px' }}>Report Comment</h2>
              <div className="bg-[#9382A5]/50 border border-gray-200 rounded-xl p-4 min-h-[150px]">
                <p className="text-black">{reportDetails.comment}</p>
              </div>

              {/* Action Buttons */}
              <ActionButtons
                onDismiss={() => console.log('dismiss')}
                onWarning={() => console.log('warning')}
                onSuspend={() => console.log('suspend')}
                onBan={() => console.log('ban')}
              />
            </div>
            <div className="w-0.5 bg-black/20 self-stretch -mr-6 -mb-10" />
            <UserHistory />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportDetails