import { useEffect, useState } from 'react';
import Nav from '../components/Nav'
import Button from '../components/button.tsx'
import StatsCards from '../components/Admin/StatsCards'
import UserReports from '../components/Admin/UserReports';
import ActiveEvents from '../components/Admin/ActiveEvents.tsx'
import EventReports from '../components/Admin/EventReports'

function Admin() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Nav current="Admin" />
      <div className="px-4 md:px-14 py-5 pb-10 bg-zinc-100 w-full">

        {/* Header */}
        <div className="w-full px-5 py-7 bg-violet-950 rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black/25 flex justify-between items-center overflow-hidden">
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white" style={{ fontSize: '48px' }}>admin_panel_settings</span>
                <h1 className="text-white title1">Reports Administration</h1>
            </div>
        </div>

        {/* Stats */}
        <div className="mt-6">
          <StatsCards />
        </div>
        <UserReports/>
        {/* Header 
        <EventsCards />
        */}
        <ActiveEvents/>
        <EventReports />

      </div>
    </div>
  )
}
export default Admin