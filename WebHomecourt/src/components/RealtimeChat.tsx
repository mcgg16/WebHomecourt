import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { RequireSession, useAuth } from "../context/AuthContext"
import { format } from "date-fns";
import StatusAlert from "./Messages/StatusAlert";
import { Filter } from "glin-profanity";
import { Profanity } from "@2toad/profanity";

//No se para que esta ocupando esto, me imagino que para que la conversacion se guarde 
//de acuerdo a que juego esta activo.
type RealtimeChatProps = {
  gameId?: number | null
  isGameLoading?: boolean
}

//Cosas necesarias para el mensaje
type ChatMessage = {
  id: string
  username: string
  message: string
  created_at: string
  game_id: number | null
}
//Groserias coloquiales 
//Despues pasar a IA que identifique hasta sarcasmo en donde estan siendo groseros
const CustomWords = [
  "pendejo", "pendeja", "chingar", "chingada", "chingón",
  "cabrón", "cabron", "pinche", "culero", "culera",
  "mamón", "mamon", "puta", "puto", "verga",
  "joto", "culiao", "hdp", "hijodeputa", "fundillo", "semen"
]
//Checar groserias en ingles y español libreria 1
const glinFilter = new Filter({
  replaceWith: "***",
  detectLeetspeak: true,
  languages: ["english", "spanish"],
})
//Checar groserias en ingles y español libreria 2
const toadFilter = new Profanity({
  languages: ["en", "es"],
})

// Detecta palabras separadas
function detectSpacedProfanity(text: string, badWords: string[]): string {
  let result = text
  for (const word of badWords) {
    // Crea regex que acepta cualquier separador entre letras: p[-. _]*u[-. _]*t[-. _]*a
    const spaced = word.split("").join("[-. _*]*")
    const regex = new RegExp(`\\b${spaced}\\b`, "gi")
    result = result.replace(regex, "***")
  }
  return result
}
// Detecta palabras pegadas
function detectConcatenated(text: string, badWords: string[]): string {
  let result = text
  for (const word of badWords) {
    const regex = new RegExp(word, "gi")
    result = result.replace(regex, "***")
  }
  return result
}
//Reemplazar muajaja
function replaceWithAsterisks(text: string, badWords: string[]): string {
  let result = text
  for (const word of badWords) {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    result = result.replace(regex, "***")
  }
  return result
}

function normalizeSymbols(text: string): string {
  // Convierte @#$%&! y variantes a ***
  return text.replace(/[@#$%&!*]{2,}/g, "***")
}

export function sanitizeMessage(text: string): string {
  const step1 = glinFilter.checkProfanity(text).processedText ?? text
  const step2 = toadFilter.censor(step1)
  const step3 = replaceWithAsterisks(step2, CustomWords)
  const step4 = detectSpacedProfanity(step3, CustomWords)
  const step5 = detectConcatenated(step4, CustomWords)
  const step6 = normalizeSymbols(step5)
  return step6
}

//Obtener el nickname para los mensajes
//Es un select que permite authenticated para que no lo bloquee silenciosamente lol
async function getDisplayName(session: Session | null): Promise<string> {
  if (!session?.user?.id) {
    return "You need to register to send a message"
  }

  const { data, error } = await supabase
    .from("user_laker")
    .select("nickname")
    .eq("user_id", session.user.id)
    .maybeSingle<{ nickname: string | null }>()

  if (error) {
    console.error("Supabase error:", error.message)
    return "You need to register to send a message"
  }

  return data?.nickname || "Guest"
}

//El verdadero discord jeje
function RealtimeChat({ gameId = null, isGameLoading = false }: RealtimeChatProps) {
  //Para obtener sesion actual
  const { session } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [message, setMessage] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  //Carga de nombre y suscripcion al canal
  useEffect(() => {
    let isMounted = true
    let channel: ReturnType<typeof supabase.channel> | null = null
    //Carga el chat
    const loadChat = async () => {
      if (isGameLoading) {
        setMessages([])
        setIsReady(false)
        setError(null)
        return
      }

      try {
        //obtiene nombre
        const name = await getDisplayName(session)
        if (!isMounted) return
        setDisplayName(name)

        if (gameId == null) {
          setMessages([])
          setIsReady(false)
          setError(null)
          return
        }
        //ESTO ES LO QUE TENGO QUE MODIFICAR SI SE DESEA GUARDAR EL CHAT POR JUEGO
        //Funciona con websockets
        //No se cual sea mejor practica, pero el chat se puede relacionar con un juego y solamente bloquearlo
        //Cuando no hay juego activo !
        const roomName = `game-${gameId}`
        // console.log(`chat:${roomName}`);
        channel = supabase.channel(`chat:${roomName}`, {
          config: {
            broadcast: {
              self: true,
            },
          },
        })
        //Setea mensajes
        setMessages([])
        setIsReady(false)
        setError(null)
        channel
          .on("broadcast", { event: "message" }, ({ payload }) => {
            const incoming = payload as ChatMessage
            setMessages((current) => {
              if (current.some((item) => item.id === incoming.id)) return current
              return [...current, incoming]
            })
          })
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              setIsReady(true)
            }

            if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
              setError("Could not connect to the chat channel.")
              setIsReady(false)
            }
          })

        channelRef.current = channel
      } catch {
        if (!isMounted) return
        setDisplayName("You need to resgister to send a message")
      }
    }

    loadChat()

    return () => {
      isMounted = false
      if (channel) {
        channelRef.current = null
        void supabase.removeChannel(channel)
      }
    }
  }, [session, gameId, isGameLoading])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    let cleanMessage = message.trim()

    cleanMessage = sanitizeMessage(cleanMessage)

    if (!cleanMessage) {
      setError("Enter a message.")
      return
    }

    if (!session) {
      setError("You need an active session to send messages.")
      return
    }

    if (gameId == null) {
      setError("Realtime chat is available only during an active game.")
      return
    }

    if (!channelRef.current || !isReady) {
      setError("Chat is not connected yet.")
      return
    }

    setError(null)

    const outgoing: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      username: displayName,
      message: cleanMessage,
      created_at: new Date().toISOString(),
      game_id: gameId,
    }

    setMessages((current) => [...current, outgoing])

    const sendResult = await channelRef.current.send({
      type: "broadcast",
      event: "message",
      payload: outgoing,
    })

    if (sendResult !== "ok") {
      setMessages((current) => current.filter((item) => item.id !== outgoing.id))
      setError("Could not send the message.")
      return
    }

    setMessage("")
  }

  return (
    <RequireSession
      fallback={
        <section className="w-full p-6 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-black/25 inline-flex flex-col justify-start items-start gap-4 overflow-hidden">
          <h2 className="text-2xl font-bold text-violet-950">Real-Time Chat</h2>
          <p className="text-sm text-zinc-600">You need to sign in to use the chat.</p>
        </section>
      }
    >
    {isGameLoading ? null : (
    <>
    {gameId == null ? (
      <section className="w-full h-full max-h-[500px] lg:max-h-[700px] p-6 bg-white rounded-2xl outline outline-1 outline-black/25 flex flex-col gap-4 overflow-hidden">
        <div className="self-stretch inline-flex justify-between items-center">
          <h2 className="text-2xl font-bold text-violet-950">Real-Time Chat</h2>
          {/* <span className="w-6 h-6 material-symbols-outlined">expand_content</span> */}
        </div>
        <div className="self-stretch h-0.5 bg-zinc-500"></div>
        <StatusAlert
          tone="info"
          title="Realtime chat is available only when there is a live game."
        />
      </section>
    ) : (
    <section className="w-full h-full max-h-[500px] lg:max-h-[700px] p-6 bg-white rounded-2xl outline outline-1 outline-black/25 flex flex-col gap-4 overflow-hidden">
    <div className="self-stretch inline-flex justify-between items-center">
        <h2 className="text-2xl font-bold text-violet-950">Real-Time Chat</h2>
        {/* <span className="w-6 h-6 material-symbols-outlined">expand_content</span> */}
      </div>
      <div className="self-stretch h-0.5 bg-zinc-500"></div>
      <div className="flex-1 min-h-0 w-full overflow-y-auto flex flex-col gap-6 pr-2">
        {messages.length === 0 ? (
          <p className="text-sm text-zinc-500">No messages yet.</p>
        ) : (
          messages.map((item) => (
            <article key={item.id} >
              <div className="flex w-full justify-between items-center gap-3">
                <strong className="min-w-0 truncate justify-start text-purple-900 text-2xl font-normal font-['Graphik']">{item.username}</strong>
                <time className="shrink-0 justify-start text-neutral-400 text-xs md:text-sm font-normal font-['Graphik'] whitespace-nowrap">
                  {format(new Date(item.created_at), "dd/MM/yyyy, hh:mm a")
                    .replace("AM", "a.m.")
                    .replace("PM", "p.m.")}
                </time>
                </div>
              <p className="justify-start text-black text-base font-normal font-['Graphik']">{item.message}</p>
            </article>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <div className="self-stretch h-0.5 bg-zinc-500"></div>
      <form onSubmit={handleSubmit} className="w-full flex items-center gap-3">
        <input
          className="flex-1 h-11 rounded-2xl border border-black/25 px-4 text-lg outline-none focus:ring-2 focus:ring-purple-400 transition"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Type a message..`}
          maxLength={240}
        />
        <button
          type="submit"
          disabled={!isReady || !session}
          className={`px-5 py-3 rounded-2xl flex items-center justify-center text-xl font-normal transition-all duration-200 
            ${!isReady || !session ? "bg-purple-900 opacity-50 text-neutral-400 cursor-not-allowed" : "bg-purple-900 text-zinc-100 hover:bg-violet-800 active:scale-95"}`}>
          Send
        </button>
      </form>
      {error ? (
        <StatusAlert
          tone="warning"
          title={error}
        />
      ) : null}
    </section>
    )}
    </>
    )}
    </RequireSession>
  )
}

export default RealtimeChat