import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Jury {
    id: number;
    name: string;
    user_name: string;
    email: string;
    password?: string;
    contact_number: string;
    address: string;
    created_at: string;
}

const useAdminJuries = () => {
    const [juries, setJuries] = useState<Jury[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchJuries = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('access_token');
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/jury/admin/juries/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setJuries(response.data);
            setIsLoading(false);
        } catch (err) {
            setError(err as Error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJuries();
    }, []);

    const createJury = async (juryData: Partial<Jury>) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/jury/admin/juries/`,
            juryData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        await fetchJuries();
        return response.data;
    };

    const updateJury = async (id: number, juryData: Partial<Jury>) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/jury/admin/juries/${id}/`,
            juryData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        await fetchJuries();
        return response.data;
    };

    const deleteJury = async (id: number) => {
        const token = localStorage.getItem('access_token');
        await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/jury/admin/juries/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        await fetchJuries();
    };

    return { juries, isLoading, error, createJury, updateJury, deleteJury, refetch: fetchJuries };
};

export default useAdminJuries;
