import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface Round {
    id: number
    round_name: string
    team1: {
        id: number
        team_id: string
        institution_name: string
        team_representative_name: string
        speaker_1_name: string
        speaker_2_name: string
        researcher_name: string
    }
    team2: {
        id: number
        team_id: string
        institution_name: string
        team_representative_name: string
        speaker_1_name: string
        speaker_2_name: string
        researcher_name: string
    }
    winner: number | null
    date: string
    time: string
    duration_in_minutes: number
    venue: string | null
    meet_url: string | null
    round_type: 'online' | 'offline'
    status: string
    created_at: string
    updated_at: string
}

const useJuryOwnRounds = () => {
    const token = localStorage.getItem('access_token')

    const { data: rounds = [], isLoading, error } = useQuery({
        queryKey: ['juryOwnRounds'],
        queryFn: async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/jury-own-rounds/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            return response.data
        },
    })

    return {
        rounds,
        isLoading,
        error,
    }
}

export default useJuryOwnRounds
