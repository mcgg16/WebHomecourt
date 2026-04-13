import type { Achievement } from '../../lib/Perfil/achievements'

type Props = {
  achievement: Achievement
}

export default function AchievementCard({ achievement }: Props) {
  const { title, description, icon, unlocked } = achievement

  return (
    <div className={`
      rounded-[15px]
      py-4 px-3
      flex flex-col items-center text-center
      shadow-[0_4px_4px_rgba(0,0,0,0.08)]
      self-stretch justify-self-stretch
      ${unlocked ? 'bg-[#E7E6E8]' : 'bg-[#F3F2F5] opacity-50'}
    `}>

      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center mb-2
        ${unlocked ? 'bg-[#542581]' : 'bg-[#DEDAE2]'}
      `}>
        <span className={`
          material-symbols-outlined text-xl
          ${unlocked ? 'text-[#FCB136]' : 'text-[#A09CA4]'}
        `}>
          {icon}
        </span>
      </div>

      <h3 className={`
        text-[13px] font-normal leading-[19.5px] mb-1
        ${unlocked ? 'text-[#11061A]' : 'text-[#A09CA4]'}
      `}>
        {title}
      </h3>

      <p className={`
        text-[11px] font-normal leading-[13.75px] text-center mb-2
        ${unlocked ? 'text-[#6F6975]' : 'text-[#A09CA4]'}
      `}>
        {description}
      </p>

      {unlocked && (
        <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#542581]/10 text-[#542581]">
          Unlocked
        </span>
      )}
    </div>
  )
}