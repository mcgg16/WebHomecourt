import { supabase } from '../supabase'

export type Friend = {
    user_id: string
    nickname: string
    username: string
    photo_url: string | null
}


export async function getFriendsList(userId: string): Promise<Friend[]> {
    if (!userId) return []
  
    const { data: friendsAsUser1, error: error1 } = await supabase
        .from('friendship')
        .select(`
            user2:user_laker!friendship_user2_fkey (
                user_id,
                nickname,
                username,
                photo_url
            )
        `)
        .eq('user1', userId)

    if (error1) {
        console.error('Error fetching friends (user1):', error1.message)
    }

    const { data: friendsAsUser2, error: error2 } = await supabase
        .from('friendship')
        .select(`
            user1:user_laker!friendship_user1_fkey (
                user_id,
                nickname,
                username,
                photo_url
            )
        `)
        .eq('user2', userId)

    if (error2) {
        console.error('Error fetching friends (user2):', error2.message)
    }

    const friends: Friend[] = []

    friendsAsUser1?.forEach(item => {
        const friend = item.user2 as unknown as Friend
        if (friend) {
            friends.push({
                user_id: friend.user_id,
                nickname: friend.nickname || friend.username || 'Usuario',
                username: friend.username || '',
                photo_url: friend.photo_url
            })
        }
    })

    friendsAsUser2?.forEach(item => {
        const friend = item.user1 as unknown as Friend
        if (friend) {
            friends.push({
                user_id: friend.user_id,
                nickname: friend.nickname || friend.username || 'Usuario',
                username: friend.username || '',
                photo_url: friend.photo_url
            })
        }
    })

    return friends
}


export async function getFriendsCount(userId: string): Promise<number> {
    if (!userId) return 0

    const { data: count1 } = await supabase
        .from('friendship')
        .select('friendship_id')
        .eq('user1', userId)

    const { data: count2 } = await supabase
        .from('friendship')
        .select('friendship_id')
        .eq('user2', userId)

    return (count1?.length || 0) + (count2?.length || 0)
}