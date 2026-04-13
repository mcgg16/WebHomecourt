export type Achievement = {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
}

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Win',
    description: 'Win your first game on the LakersCourt',
    icon: 'trophy',
    unlocked: true
  },
  {
    id: '2',
    title: 'On Fire',
    description: 'Win 5 games in a row',
    icon: 'mode_heat',
    unlocked: true
  },
  {
    id: '3',
    title: 'All-Star',
    description: 'Get a reputation above 4.7',
    icon: 'star_rate',
    unlocked: true
  },
  {
    id: '4',
    title: 'Showtime Supporter',
    description: 'Send 100 messages in live chat',
    icon: 'taunt',
    unlocked: true
  },
  {
    id: '5',
    title: 'Loyal Fan',
    description: 'Log in 30 days in a row',
    icon: 'crown',
    unlocked: true
  },
  {
    id: '6',
    title: 'Champion',
    description: 'Win a 3v3 or 5v5 LakersCourt tournament',
    icon: 'Medal',
    unlocked: true
  },
  {
    id: '7',
    title: 'Legend',
    description: 'Reach 100 games played',
    icon: 'award_star',
    unlocked: false
  },
  {
    id: '8',
    title: 'Veteran Status',
    description: 'Account active for 1 year',
    icon: 'military_tech',
    unlocked: false
  }
]