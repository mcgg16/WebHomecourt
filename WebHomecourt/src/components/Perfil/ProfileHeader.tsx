import { supabase } from "../../lib/supabase"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
const DEFAULT_AVATAR = "https://ptbcoxaguvbwprxdundz.supabase.co/storage/v1/object/public/user_images/profile_picture_default.png"

// tipos
export type ProfileData = {
    nickname: string
    photo_url: string | null
    credits: number
    reputation: number
}

export type ProfileStats = {
    friendsCount: number
    eventsCreated: number
    eventsAttended: number
    cardsCollected: number
}

// funciones de los queries 
export async function getProfileData(userId: string): Promise<ProfileData | null> {
    if (!userId) throw new Error("Invalid userId")

    const { data, error } = await supabase
        .from("user_laker")
        .select("nickname, photo_url, credits, reputation")
        .eq("user_id", userId)
        .single()

    if (error) {
        console.error("Supabase error:", error.message)
        throw new Error("Failed to get profile data")
    }

    return data
}

export async function getProfileStats(userId: string): Promise<ProfileStats> {
    if (!userId) throw new Error("Invalid userId")

    // friends count
    const { data: friendsData, error: friendsError } = await supabase
        .from("friendship")
        .select("friendship_id")
        .or(`user1.eq.${userId},user2.eq.${userId}`)

    if (friendsError) console.error("Friends error:", friendsError.message)
    console.log("Friends data:", friendsData)

    // events created
    const { data: eventsCreatedData, error: eventsCreatedError } = await supabase
        .from("event")
        .select("event_id")
        .eq("created_user_id", userId)

    if (eventsCreatedError) console.error("Events created error:", eventsCreatedError.message)

    // events attended
    const { data: eventsAttendedData, error: eventsAttendedError } = await supabase
        .from("event_participant")
        .select("event_participant_id")
        .eq("user_id", userId)

    if (eventsAttendedError) console.error("Events attended error:", eventsAttendedError.message)
    console.log("Events attended data:", eventsAttendedData)

    // cards collected
    const { data: cardsData, error: cardsError } = await supabase
        .from("user_card")
        .select("card_id")
        .eq("user_id", userId)

    if (cardsError) console.error("Cards error:", cardsError.message)

    return {
        friendsCount: friendsData?.length || 0,
        eventsCreated: eventsCreatedData?.length || 0,
        eventsAttended: eventsAttendedData?.length || 0,
        cardsCollected: cardsData?.length || 0,
    }
}

// stat divider componente
function StatDivider() {
    return <div className="w-[1px] h-6 bg-[#9482A5] opacity-30"></div>
}

// main componente
function ProfileHeader({ userId }: { userId: string }) {
    const navigate = useNavigate()
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [stats, setStats] = useState<ProfileStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const [profileData, statsData] = await Promise.all([
                    getProfileData(userId),
                    getProfileStats(userId)
                ])
                setProfile(profileData)
                setStats(statsData)
            } catch (e) {
                console.error("Can't load profile:", e)
            }
            setLoading(false)
        }
        fetchData()
    }, [userId])

    if (loading) {
        return (
            <div className="bg-gradient-to-r from-morado-oscuro to-morado-lakers rounded-2xl p-6 animate-pulse">
                <div className="h-24 w-24 bg-morado-bajo rounded-full"></div>
            </div>
        )
    }

    if (!profile || !stats) {
        return <p>Error loading profile</p>
    }

    return (
        <div className="bg-morado-oscuro rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
                <img
                    src={profile.photo_url || DEFAULT_AVATAR}
                    alt={profile.nickname}
                    className="w-[110px] h-[112px] rounded object-cover flex-shrink-0"
                />
                <div>
                    <h1 className="text-white text-4xl font-bold">
                        {profile.nickname}
                    </h1>
                    <div className="flex items-center gap-1 mt-1">
                        <img src="/groups.svg" alt="Friends" className="w-4 h-4" />
                        <span className="text-[#E7E6E8] text-sm">
                            {stats.friendsCount} Friends
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <img src="/Star.svg" alt="Star" className="w-5 h-5" />
                    <span className="text-amarillo-lakers text-[22px]">
                        {(profile.reputation ?? 0).toFixed(1)}
                    </span>
                    <span className="text-[#9482A5] text-sm ml-1">
                        Reputation
                    </span>
                </div>

                <StatDivider />
                <div className="flex items-center gap-1">
                    <span className="text-[#F3F2F3] text-[22px]">
                        {profile.credits}
                    </span>
                    <span className="text-[#9482A5] text-sm">
                        Credits
                    </span>
                </div>

                <StatDivider />
                <div className="flex items-center gap-1">
                    <span className="text-[#F3F2F3] text-[22px]">
                        {stats.eventsCreated}
                    </span>
                    <span className="text-[#9482A5] text-sm">
                        Events Created
                    </span>
                </div>

                <StatDivider />

                <div className="flex items-center gap-1">
                    <span className="text-[#F3F2F3] text-[22px]">
                        {stats.eventsAttended}
                    </span>
                    <span className="text-[#9482A5] text-sm">
                        Events Attended
                    </span>
                </div>

                <StatDivider />

                <div className="flex items-center gap-1">
                    <span className="text-[#F3F2F3] text-[22px]">
                        {stats.cardsCollected}
                    </span>
                    <span className="text-[#9482A5] text-sm">
                        Cards collected
                    </span>
                </div>
                </div>

                <button
                    onClick={() => navigate("/editar-perfil")}
                    className="flex items-center gap-3 bg-morado-lakers hover:bg-morado-lakers/90 text-white px-8 py-4 rounded-[20px] transition-colors"
                >
                    <img src="/edit.svg" alt="Edit" className="w-6 h-6" />
                    <span className="text-[32px] font-semibold">
                        Edit Profile
                    </span>
                </button>
            </div>
        </div>
    )
}

export default ProfileHeader