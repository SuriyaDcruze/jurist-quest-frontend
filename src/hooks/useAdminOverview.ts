import { useState, useEffect } from 'react';
import axios from 'axios';

interface AdminOverview {
    total_teams: number;
    active_teams: number;
    total_juries: number;
    active_juries: number;
    teams_by_round: { [key: string]: number };
}

const useAdminOverview = () => {
    const [overview, setOverview] = useState<AdminOverview>({
        total_teams: 0,
        active_teams: 0,
        total_juries: 0,
        active_juries: 0,
        teams_by_round: {},
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/admin/overview/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setOverview(response.data);
                setIsLoading(false);
            } catch (err) {
                setError(err as Error);
                setIsLoading(false);
            }
        };

        fetchOverview();
    }, []);

    return { overview, isLoading, error };
};

export default useAdminOverview;
