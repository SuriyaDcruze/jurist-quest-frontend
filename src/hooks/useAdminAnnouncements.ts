import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export interface Announcement {
    id: number
    name: string
    description: string
    created_at: string
    updated_at: string
}

export type AnnouncementType = 'team' | 'jury'

const useAdminAnnouncements = (type: AnnouncementType = 'team') => {
    const queryClient = useQueryClient()
    const token = localStorage.getItem('access_token')

    const endpoint = type === 'jury' ? '/api/admin-jury-announcements/' : '/api/admin-announcements/'
    const queryKey = type === 'jury' ? ['adminJuryAnnouncements'] : ['adminAnnouncements']

    const { data: announcements = [], isLoading, error } = useQuery({
        queryKey,
        queryFn: async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}${endpoint}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            return response.data
        },
    })

    const createAnnouncement = useMutation({
        mutationFn: async (announcementData: Partial<Announcement>) => {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}${endpoint}`,
                announcementData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey })
        },
    })

    const updateAnnouncement = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<Announcement> }) => {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}${endpoint}${id}/`,
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
            queryClient.invalidateQueries({ queryKey })
        },
    })

    const deleteAnnouncement = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}${endpoint}${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey })
        },
    })

    return {
        announcements,
        isLoading,
        error,
        createAnnouncement: createAnnouncement.mutateAsync,
        updateAnnouncement: updateAnnouncement.mutateAsync,
        deleteAnnouncement: deleteAnnouncement.mutateAsync,
        refetch: () => queryClient.invalidateQueries({ queryKey }),
    }
}

export default useAdminAnnouncements
