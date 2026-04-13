import { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import ProfileHeader from "../components/Perfil/ProfileHeader"
import FriendsList from "../components/Perfil/FriendsList"
import VotingActivity from "../components/Perfil/VotingActivity"
import UpcomingEvents from "../components/Perfil/UpcomingEvents"
import { supabase } from '../lib/supabase'
import { getUpcomingEvents, type EventItem } from '../lib/Perfil/events'
import Achievements from '../components/Perfil/Achievements'
import SettingsSection from '../components/Perfil/SettingsSection'

type CurrentUser = {
    user_id: string
    nickname: string
    photo_url: string
}

function Perfil() {
    const userId = "ac3a5447-1b6f-4324-8830-5ddc2d7b2c47"
    
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
    const [events, setEvents] = useState<EventItem[]>([])

    useEffect(() => {
        async function loadData() {
       
            const { data: userData } = await supabase
                .from('user_laker')
                .select('user_id, nickname, photo_url')
                .eq('user_id', userId)
                .single()

            if (userData) {
                setCurrentUser({
                    user_id: userData.user_id,
                    nickname: userData.nickname || 'Usuario',
                    photo_url: userData.photo_url || ''
                })
            }

           
            const eventsData = await getUpcomingEvents(userId)
            setEvents(eventsData)
        }

        loadData()
    }, [userId])

    return (
        <div className="min-h-screen bg-[#F3F2F5]">
            <div className="flex flex-col items-center justify-center">
                <Nav current="Perfil" />
            </div>

            <div className="px-[60px] py-[20px] flex flex-col gap-[31px]">
                <ProfileHeader userId={userId} />

                <FriendsList
                    userId={userId}
                    currentUser={currentUser}
                />

                <div className="grid grid-cols-2 gap-[31px]">
                    <VotingActivity userId={userId} />
                    <UpcomingEvents events={events} />
                </div>

                <Achievements />

                <SettingsSection />
            </div>
        </div>
    )
}

export default Perfil