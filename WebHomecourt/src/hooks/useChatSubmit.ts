import type { FormEvent } from "react"
import type { Session } from "@supabase/supabase-js"
import { sanitizeMessage, type ChatMessage } from "../components/RealtimeChat"
import { supabase } from "../lib/supabase"

type UseChatSubmitParams = {
  message: string
  session: Session | null
  gameId: number | null
  displayName: string
  isReady: boolean
  channelRef: React.MutableRefObject<ReturnType<typeof supabase.channel> | null>
  setError: (error: string | null) => void
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
  setMessage: (message: string) => void
}

export function useChatSubmit({
  message,
  session,
  gameId,
  displayName,
  isReady,
  channelRef,
  setError,
  setMessages,
  setMessage,
}: UseChatSubmitParams) {
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

  return { handleSubmit }
}
