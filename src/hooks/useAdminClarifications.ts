import { useState, useEffect } from 'react'
import axios from 'axios'

export interface Clarification {
    id: number
    team: number
    team_details: {
        id: number
        team_id: string
        team_representative_name: string
        institution_name: string
    }
    subject: string
    question: string
    response: string | null
    created_at: string
    updated_at: string
}

const useAdminClarifications = () => {
    const [clarifications, setClarifications] = useState<Clarification[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchClarifications = async () => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem('access_token')
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/admin-clarifications/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            setClarifications(response.data)
            setIsLoading(false)
        } catch (err) {
            setError(err as Error)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchClarifications()
    }, [])

    const updateClarification = async ({ id, data }: { id: number; data: { response: string } }) => {
        const token = localStorage.getItem('access_token')
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/admin-clarifications/${id}/`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        await fetchClarifications()
        return response.data
    }

    return {
        clarifications,
        isLoading,
        error,
        updateClarification,
        refetch: fetchClarifications,
    }
}

export default useAdminClarifications
