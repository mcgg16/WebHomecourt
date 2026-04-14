import { supabase } from '../supabase'

export type Achievement = {
  id: number
  title: string
  description: string
  icon: string
  unlocked: boolean
}

export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  if (!userId) return []

  const { data: allAchievements, error: achievementsError } = await supabase
    .from('achievement')
    .select('achievement_id, title, description, icon')
    .order('achievement_id')

  if (achievementsError || !allAchievements) {
    console.error('Error fetching achievements:', achievementsError)
    return []
  }

  const { data: userAchievements } = await supabase
    .from('user_achievement')
    .select('achievement_id')
    .eq('user_id', userId)

  const unlockedIds = new Set(
    userAchievements?.map(ua => ua.achievement_id) || []
  )

  return allAchievements.map(a => ({
    id: a.achievement_id,
    title: a.title,
    description: a.description,
    icon: a.icon,
    unlocked: unlockedIds.has(a.achievement_id)
  }))
}
