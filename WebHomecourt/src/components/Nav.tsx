import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import { getUserById, type User } from './User'
import { useAuth } from '../context/AuthContext'

const DEFAULT_AVATAR = "https://ptbcoxaguvbwprxdundz.supabase.co/storage/v1/object/public/user_images/profile_picture_default.png"

const pages = [
  { label: 'Home',          path: '/' },
  { label: 'Agenda',        path: '/agenda' },
  { label: 'Statistics',  path: '/estadisticas' },
  { label: 'LakersCourt',   path: '/lakerscourt' },
  { label: 'Dunk Royale',         path: '/juego' },
  { label: 'Store',         path: '/store' },
]

interface NavProps {
  current: string
}

function Nav({ current }: NavProps) {
  const navigate = useNavigate()
  const { user: authUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      if (!authUser?.id) return
      const data = await getUserById(authUser.id)
      setUser(data)
    }

    loadUser()
  }, [authUser?.id])

  return (
    <div className="w-full">
      <div className="mx-auto w-full ">
        <div className="w-full h-10  bg-gradient-to-r from-purple-900 to-amber-400" />

        <div className="w-full px-2 md:px-15 py-6 md:py-2 inline-flex flex-col xl:flex-row justify-between items-center gap-6 overflow-hidden">
          <img
            className="h-20 w-auto object-contain"
            src="/lakers_homecourt.png"
            alt="Homecourt logo"
          />

          <div className="flex flex-wrap justify-center items-center gap-7">
            {pages.map((p) => {
              const isCurrent = p.label === current

              return (
                <button
                  key={p.path}
                  type="button"
                  onClick={() => navigate(p.path)}
                  disabled={isCurrent}
                  className={[
                    "justify-start text-purple-900 text-2xl font-normal font-['Graphik'] transition-opacity",
                    isCurrent ? 'opacity-100 cursor-default' : 'cursor-pointer hover:opacity-70',
                  ].join(' ')}
                >
                  {p.label}
                </button>
              )
            })}
          </div>

          <div className="flex justify-start items-center gap-7">
            <div className="p-2.5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-black/25 flex justify-start items-center gap-3.5">
              <span className="material-symbols-outlined text-amber-400 text-[200px]">payments</span>
                      
              <div className="justify-start text-black text-2xl font-normal font-['Graphik']">{user?.credits ?? 0}</div>
            </div>

            <button
              onClick={() => navigate('/perfil')}
              className="w-15 h-15 relative rounded-full outline outline-2 outline-offset-[-2px] outline-gray-200 overflow-hidden bg-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img
                className="w-full h-full object-cover"
                src={user?.photo_url || DEFAULT_AVATAR}
                alt="User avatar"
              />
            </button>
          </div>
        </div>

        <div className="w-full h-0.5 bg-neutral-400/40" />
      </div>
    </div>
  )
}

export default Nav
