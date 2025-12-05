import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Team {
    id: number;
    team_id: string;
    current_round: string;
    jury: number | null;
    jury_details?: {
        id: number;
        name: string;
        email: string;
        contact_number: string;
    };
    team_representative_name: string;
    team_representative_email: string;
    speaker_1_name: string;
    speaker_1_course_type: string;
    speaker_1_email: string;
    speaker_1_contact_number: string;
    speaker_2_name: string;
    speaker_2_course_type: string;
    researcher_name: string;
    institution_name: string;
    class_teacher_name: string;
    class_teacher_contact_number: string;
    user_password: string;
    is_active: boolean;
    created_at: string;
}

const useAdminTeams = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchTeams = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('access_token');
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/admin/teams/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTeams(response.data);
            setIsLoading(false);
        } catch (err) {
            setError(err as Error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const createTeam = async (teamData: Partial<Team>) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/admin/teams/`,
            teamData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        await fetchTeams();
        return response.data;
    };

    const updateTeam = async (id: number, teamData: Partial<Team>) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/admin/teams/${id}/`,
            teamData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        await fetchTeams();
        return response.data;
    };

    const deleteTeam = async (id: number) => {
        const token = localStorage.getItem('access_token');
        await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/admin/teams/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        await fetchTeams();
    };

    return { teams, isLoading, error, createTeam, updateTeam, deleteTeam, refetch: fetchTeams };
};

export default useAdminTeams;
