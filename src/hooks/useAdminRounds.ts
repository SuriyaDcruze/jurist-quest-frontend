import { useState, useEffect } from 'react'
import axios from 'axios'

export interface TeamMarks {
    team_id: string
    knowledge_of_law: number
    application_of_law_to_facts: number
    ingenuity_and_ability_to_answer_questions: number
    persuasiveness: number
    time_management_and_organization: number
    style_poise_courtesy_and_demeanor: number
    language_and_presentation: number
    total: number
    overall_comments: string | null
}

export interface RoundMarks {
    team1?: TeamMarks
    team2?: TeamMarks
}

export interface Round {
    id: number
    round_name: string
    team1: number | null
    team2: number | null
    team1_details: {
        id: number
        team_id: string
        team_representative_name: string
        institution_name: string
        current_round: string
    } | null
    team2_details: {
        id: number
        team_id: string
        team_representative_name: string
        institution_name: string
        current_round: string
    } | null
    winner: number | null
    winner_details: {
        id: number
        team_id: string
        team_representative_name: string
    } | null
    date: string
    time: string
    duration_in_minutes: number
    venue: string | null
    meet_url: string | null
    round_type: string
    status: string
    judge: {
        id: number
        name: string
    } | null
    marks: RoundMarks | null
}

export interface EligibleTeam {
    id: number
    team_id: string
    team_representative_name: string
    institution_name: string
    current_round: string
    jury: {
        id: number
        name: string
    } | null
}

const useAdminRounds = () => {
    const [rounds, setRounds] = useState<Round[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchRounds = async () => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem('access_token')
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/admin/rounds/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            setRounds(response.data)
            setIsLoading(false)
        } catch (err) {
            setError(err as Error)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRounds()
    }, [])

    const createRound = async (roundData: Partial<Round>) => {
        const token = localStorage.getItem('access_token')
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/admin/rounds/`,
            roundData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        await fetchRounds()
        return response.data
    }

    const updateRound = async ({ id, data }: { id: number; data: Partial<Round> }) => {
        const token = localStorage.getItem('access_token')
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/admin/rounds/${id}/`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        await fetchRounds()
        return response.data
    }

    const deleteRound = async (id: number) => {
        const token = localStorage.getItem('access_token')
        await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/admin/rounds/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        await fetchRounds()
    }

    const getEligibleTeams = async (roundName: string, juryId?: number): Promise<EligibleTeam[]> => {
        const token = localStorage.getItem('access_token')
        const params = new URLSearchParams({ round_name: roundName })
        if (juryId) {
            params.append('jury_id', juryId.toString())
        }

        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/admin/rounds/eligible_teams/?${params.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        return response.data
    }

    return {
        rounds,
        isLoading,
        error,
        createRound,
        updateRound,
        deleteRound,
        getEligibleTeams,
        refetch: fetchRounds,
    }
}

export default useAdminRounds
