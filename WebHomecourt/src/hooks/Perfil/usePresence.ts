import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

export type UserPresenceData = {
    user_id: string
    nickname: string
    photo_url: string
    online_at: string
}

type PresenceState = Record<string, UserPresenceData>

export function usePresence(currentUser: { 
    user_id: string
    nickname: string
    photo_url: string 
} | null) {
    const [onlineUsers, setOnlineUsers] = useState<PresenceState>({})
    const [channel, setChannel] = useState<RealtimeChannel | null>(null)

    useEffect(() => {
        if (!currentUser?.user_id) return

      
        const presenceChannel = supabase.channel('online-users', {
            config: { 
                presence: { 
                    key: currentUser.user_id 
                } 
            }
        })

      
        presenceChannel
            .on('presence', { event: 'sync' }, () => {
                const state = presenceChannel.presenceState()
                const users: PresenceState = {}

                Object.keys(state).forEach(key => {
                    const presences = state[key] as unknown as UserPresenceData[]
                    if (presences && presences[0]) {
                        users[key] = presences[0]
                    }
                })

                setOnlineUsers(users)
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                console.log('Usuario conectado:', key, newPresences)
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                console.log('Usuario desconectado:', key, leftPresences)
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                
                    await presenceChannel.track({
                        user_id: currentUser.user_id,
                        nickname: currentUser.nickname || 'Usuario',
                        photo_url: currentUser.photo_url || '',
                        online_at: new Date().toISOString()
                    })
                    console.log('Presencia activada para:', currentUser.nickname)
                }
            })

        setChannel(presenceChannel)

  
        return () => {
            presenceChannel.unsubscribe()
        }
    }, [currentUser?.user_id, currentUser?.nickname, currentUser?.photo_url])


    const isUserOnline = (userId: string): boolean => {
        return userId in onlineUsers
    }

  
    const getOnlineUserIds = (): string[] => {
        return Object.keys(onlineUsers)
    }

    return { 
        onlineUsers, 
        isUserOnline, 
        getOnlineUserIds,
        channel 
    }
}