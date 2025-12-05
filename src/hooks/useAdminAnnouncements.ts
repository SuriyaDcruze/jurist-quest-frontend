import { useState, useEffect } from 'react'
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
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const endpoint = type === 'jury' ? '/api/admin-jury-announcements/' : '/api/admin-announcements/'

    const fetchAnnouncements = async () => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem('access_token')
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}${endpoint}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            setAnnouncements(response.data)
            setIsLoading(false)
        } catch (err) {
            setError(err as Error)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAnnouncements()
    }, [type]) // Re-fetch when type changes

    const createAnnouncement = async (announcementData: Partial<Announcement>) => {
        const token = localStorage.getItem('access_token')
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}${endpoint}`,
            announcementData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        await fetchAnnouncements()
        return response.data
    }

    const updateAnnouncement = async ({ id, data }: { id: number; data: Partial<Announcement> }) => {
        const token = localStorage.getItem('access_token')
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}${endpoint}${id}/`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        await fetchAnnouncements()
        return response.data
    }

    const deleteAnnouncement = async (id: number) => {
        const token = localStorage.getItem('access_token')
        await axios.delete(
            `${import.meta.env.VITE_API_URL}${endpoint}${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        await fetchAnnouncements()
    }

    return {
        announcements,
        isLoading,
        error,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        refetch: fetchAnnouncements,
    }
}

export default useAdminAnnouncements
