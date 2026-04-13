import { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import ProfileHeader from "../components/Perfil/ProfileHeader"
import FriendsList from "../components/Perfil/FriendsList"
import { supabase } from '../lib/supabase'

type CurrentUser = {
    user_id: string
    nickname: string
    photo_url: string
}

function Perfil() {
    // TODO: Cambiar a auth dinámico cuando esté listo
    const userId = "ac3a5447-1b6f-4324-8830-5ddc2d7b2c47"
    
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

    useEffect(() => {
        async function loadCurrentUser() {
            const { data, error } = await supabase
                .from('user_laker')
                .select('user_id, nickname, photo_url')
                .eq('user_id', userId)
                .single()

            if (error) {
                console.error('Error loading current user:', error.message)
                return
            }

            if (data) {
                setCurrentUser({
                    user_id: data.user_id,
                    nickname: data.nickname || 'Usuario',
                    photo_url: data.photo_url || ''
                })
            }
        }

        loadCurrentUser()
    }, [userId])

    return (
        <div className="min-h-screen bg-Background">
            <div className="flex flex-col items-center justify-center">
                <Nav current="Perfil" />
            </div>
            <div className="px-[60px] py-[20px] flex flex-col gap-[31px]">
                <ProfileHeader userId={userId} />
                
                <FriendsList 
                    userId={userId} 
                    currentUser={currentUser}
                />
            </div>
        </div>
    )
}

export default Perfil