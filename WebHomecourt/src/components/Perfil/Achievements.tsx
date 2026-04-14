import { mockAchievements } from '../../lib/Perfil/achievements'
import AchievementCard from './AchievementCard'

export default function Achievements() {
  return (
    <div className="bg-white rounded-[15px] overflow-hidden border border-black/8 shadow-[0_4px_4px_rgba(0,0,0,0.08)]">
      
      <div className="h-[59px] bg-morado-oscuro flex items-center px-6">
        <span className="text-[#F3F2F3] text-[18px] font-normal leading-[27px]">
          Achievements
        </span>
      </div>

      <div className="p-4 grid grid-cols-4 gap-4">
        {mockAchievements.map((achievement) => (
          <AchievementCard 
            key={achievement.id}
            achievement={achievement}
          />
        ))}
      </div>
    </div>
  )
}