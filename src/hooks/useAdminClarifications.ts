import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
    const queryClient = useQueryClient()
    const token = localStorage.getItem('access_token')

    const { data: clarifications = [], isLoading, error } = useQuery({
        queryKey: ['adminClarifications'],
        queryFn: async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/admin-clarifications/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            return response.data
        },
    })

    const updateClarification = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: { response: string } }) => {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/admin-clarifications/${id}/`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminClarifications'] })
        },
    })

    return {
        clarifications,
        isLoading,
        error,
        updateClarification: updateClarification.mutateAsync,
        refetch: () => queryClient.invalidateQueries({ queryKey: ['adminClarifications'] }),
    }
}

export default useAdminClarifications
