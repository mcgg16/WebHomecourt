import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { supabase } from "../lib/supabase"

type RealtimeChatProps = {
  gameId?: number | null
}

type ChatMessage = {
  id: string
  username: string
  message: string
  created_at: string
  game_id: number | null
}

function RealtimeChat({
  gameId = null
}: RealtimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    const roomName = gameId == null ? "global" : `game-${gameId}`
    const channel = supabase.channel(`chat:${roomName}`, {
      config: {
        broadcast: {
          self: true
        }
      }
    })

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

    return () => {
      channelRef.current = null
      void supabase.removeChannel(channel)
    }
  }, [gameId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanUsername = username.trim()
    const cleanMessage = message.trim()

    if (!cleanUsername || !cleanMessage) {
      setError("Enter your name and a message.")
      return
    }

    if (!channelRef.current || !isReady) {
      setError("Chat is not connected yet.")
      return
    }

    setError(null)

    const outgoing: ChatMessage = {
      id: crypto.randomUUID(),
      username: cleanUsername,
      message: cleanMessage,
      created_at: new Date().toISOString(),
      game_id: gameId
    }

    setMessages((current) => [...current, outgoing])

    const sendResult = await channelRef.current.send({
      type: "broadcast",
      event: "message",
      payload: outgoing
    })

    if (sendResult !== "ok") {
      setMessages((current) => current.filter((item) => item.id !== outgoing.id))
      setError("Could not send the message.")
      return
    }

    setMessage("")
  }

  return (
    <section className="mt-8 rounded-2xl bg-white p-5 shadow-[0px_4px_16px_rgba(0,0,0,0.15)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-violet-950">Live Chat</h2>
        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800">
          {isReady ? "Channel connected" : "Connecting..."}
        </span>
      </div>

      <div className="h-72 overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-50 p-3">
        {messages.length === 0 ? (
          <p className="text-sm text-zinc-500">No messages yet.</p>
        ) : (
          messages.map((item) => (
            <article key={item.id} className="mb-3 rounded-lg bg-white p-3 shadow-sm">
              <div className="mb-1 flex items-center justify-between">
                <strong className="text-sm text-violet-900">{item.username}</strong>
                <time className="text-xs text-zinc-500">
                  {new Date(item.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </time>
              </div>
              <p className="text-sm text-zinc-700">{item.message}</p>
            </article>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-[220px_1fr_auto]">
        <input
          className="h-11 rounded-lg border border-zinc-300 px-3 text-sm text-zinc-800 outline-none ring-violet-300 focus:ring"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Your name"
          maxLength={40}
        />
        <input
          className="h-11 rounded-lg border border-zinc-300 px-3 text-sm text-zinc-800 outline-none ring-violet-300 focus:ring"
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write a message"
          maxLength={240}
        />
        <button
          type="submit"
          className="h-11 rounded-lg bg-violet-950 px-5 text-sm font-semibold text-white transition hover:bg-violet-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Send
        </button>
      </form>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </section>
  )
}

export default RealtimeChat