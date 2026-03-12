import { supabase } from "../lib/supabase"
import { useEffect, useState } from "react"

/*export type CollectedCard = { 
    user_id: string
    card_id: string
    player_name: string
    web_url: string
    unlocked: boolean
    attack: number
    defense: number 
    velocity: number 
    cost: number
};*/
export type CollectedCard = { 
    card_id: string
    player_name: string
    web_url: string
    cost: number
    unlocked: boolean
    rare: boolean
};

// Stores the collection of cards
export async function getUserCards(userId: string): Promise<CollectedCard[]> {
  if (!userId) {
    throw new Error("Invalid userId")
  }
  
  // Connection to supabase
  const { data, error } = await supabase
  .from("user_card")
  .select(`
    unlocked,
    card (
      card_id,
      player_name,
      web_url,
      cost,
      rare
    )
  `)
  .eq("user_id", userId)
  .eq("unlocked", true)
  
  console.log("raw data:", JSON.stringify(data, null, 2))
  console.log("error:", error)

  if (error) {
    console.error("Supabase error:", error.message)
    throw new Error("Failed to get user cards")
  }

  // Data is not formatted as array edge handle mugre supabase
  if (!Array.isArray(data)) return []

  // Supabase can return card as an object or array depending on relationship type.
  // We normalize both cases with a simple conditional.
  const cards: CollectedCard[] = []
 
  for (const row of data) {
  const cardData = Array.isArray(row.card) ? row.card[0] : row.card
  if (!cardData) continue

  cards.push({
    card_id: cardData.card_id,
    player_name: cardData.player_name,
    web_url: cardData.web_url,
    cost: cardData.cost,
    rare: cardData.rare,
    unlocked: row.unlocked,   // unlocked lives on user_card row
  })}
 
  return cards
}

function DisplayUserCards({ userId }: { userId: string }) {
  const [cards, setCards] = useState<CollectedCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)  // ← new error state

  useEffect(() => {
    async function fetchCards() {
      setLoading(true)
      try {
        const unlockedCards = await getUserCards(userId)
        setCards(unlockedCards)
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error"
        console.error("Failed to load cards:", msg)
        setError(msg)   // ← now you'll actually see the error
        setCards([])
      }
      setLoading(false)
    }
    fetchCards()
  }, [userId])

  if (loading) {
    return <p>Loading your collection...</p>
  }
  if (!cards.length) {
    return <p>No cards unlocked yet. Start playing to buy your first player pack!</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map(card => (
        <div
          key={card.card_id}
          className="bg-white rounded-md justify-center text-center px-2 py-3 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          <h1 className="text-lg font-black font-['Graphik']">{card.player_name}</h1>
          {/* Display rare status */}
          {card.rare && <p className="text-yellow-600 font-bold">Rare</p>}
          <img src={card.web_url} alt={card.player_name} className="w-48 mx-auto" />
          <p>Value: ${card.cost}</p>
          <p>Unlocked: {card.unlocked ? "Yes" : "No"}</p>
        </div>
      ))}
    </div>
  )
}

export default DisplayUserCards