import { supabase } from "../lib/supabase"
import { useEffect, useState } from "react"

export type CollectedCard = { 
    user_id: string
    card_id: string
    player_name: string
    web_url: string
    unlocked: boolean
    attack: number
    defense: number 
    velocity: number 
    cost: number
};

// Stores the collection of cards
export async function getUserCards(userId: string): Promise<CollectedCard[] | null> {
  if (!userId) {
    throw new Error("Invalid userId")
  }
  
  // Connection to supabase
  const { data, error } = await supabase
    .from("user_card")
    // Will use unlocked from relationship table and rest from the card table 
    .select(`
      unlocked,
      card:card_id (
        card_id, 
        player_name, 
        web_url, 
        cost
      )
    `)
    // Check what is equals
    .eq("user_id", userId)
    .eq("unlocked", true)
    // Will order it by the card_id
    .order("card_id", { foreignTable: "card" })

  if (error) {
    console.error("Supabase error:", error.message)
    throw new Error("Failed to get user cards")
  }

  // Returns are werid so data in the array is "flattened" so that each of them is a new card, and also show the unlocked status
  return (data ?? []).map(row => ({
    ...row.card,
    unlocked: row.unlocked,
  }))
}

function DisplayUserCards({ userId }: { userId: string }) {
  const [cards, setCards] = useState<CollectedCard[]>([])
  const [loading, setLoading] = useState(true)

  return (
    <div className="bg-white rounded-md justify-center text-center px-2 py-3 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"> 
        <h1 className="text-lg font-black font-['Graphik']">LeBron</h1>
        <p>Rare: TRUE</p>
        <img src="https://supabasekong.a0gv.tech/storage/v1/object/sign/Fotos/lebron.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJGb3Rvcy9sZWJyb24uanBnIiwiaWF0IjoxNzczMzMyMDQ5LCJleHAiOjE4MDQ4NjgwNDl9.5LnWPny5UQEwTyJjqpM_zLGnGGsveLMWelGC91U5Pig" className="w-48" />
        <p>Value: $2000</p>
    </div>
  )
}

export default DisplayUserCards