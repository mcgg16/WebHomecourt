import { supabase } from '../supabase'

export type VoteActivity = {
    id: number
    bracketQuestion: string     
    votedOption: string          
    votePercentage: number       
    dateVoted: string           
}

export async function getUserVotingActivity(userId: string): Promise<VoteActivity[]> {
    if (!userId) return []


    const { data: userVotes, error } = await supabase
        .from('user_vote')
        .select('*')
        .eq('user_id', userId)
        .order('date_voted', { ascending: false })
        .limit(5)

    if (error) {
        console.error("Error fetching votes:", error)
        return []
    }

    if (!userVotes || userVotes.length === 0) return []

    const results: VoteActivity[] = []

    for (const vote of userVotes) {
       
        const { data: bracket } = await supabase
            .from('bracket')
            .select('question')
            .eq('id', vote.bracket_id)
            .single()

        
        const { data: option } = await supabase
            .from('bracket_question')
            .select('descripcion')
            .eq('id', vote.bracket_question_id_voted)
            .single()

        if (!bracket || !option) {
            console.log("Missing data:", vote)
            continue
        }

       
        const { count: totalVotes } = await supabase
            .from('user_vote')
            .select('id', { count: 'exact', head: true })
            .eq('bracket_id', vote.bracket_id)

   
        const { count: optionVotes } = await supabase
            .from('user_vote')
            .select('id', { count: 'exact', head: true })
            .eq('bracket_id', vote.bracket_id)
            .eq('bracket_question_id_voted', vote.bracket_question_id_voted)

        const percentage = totalVotes && totalVotes > 0
            ? Math.round((optionVotes || 0) / totalVotes * 100)
            : 0

        const formattedDate = new Date(vote.date_voted).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short'
        })

        results.push({
            id: vote.id,
            bracketQuestion: bracket.question,
            votedOption: option.descripcion,
            votePercentage: percentage,
            dateVoted: formattedDate
        })
    }

    return results
}