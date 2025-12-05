import React from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import useJuryMemorials from "@/hooks/useJuryMemorials";

interface TeamMemorialsProps {
    teamId: string;
}

const TeamMemorials: React.FC<TeamMemorialsProps> = ({ teamId }) => {
    const { juryMemorials, isLoading, error } = useJuryMemorials(teamId);

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading memorials...
            </div>
        );
    }

    if (error) {
        return <p className="text-xs text-red-500">Failed to load memorials</p>;
    }

    if (juryMemorials.length === 0) {
        return <p className="text-xs text-gray-500 italic">No memorials submitted</p>;
    }

    return (
        <div className="space-y-2 mt-2">
            <p className="text-xs font-semibold text-gray-600">Memorials</p>
            <div className="grid gap-2">
                {juryMemorials.map((memorial) => (
                    <div
                        key={memorial.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100"
                    >
                        <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            <span className="text-sm truncate" title={memorial.moot_problem_display}>
                                {memorial.moot_problem_display || memorial.moot_problem}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            asChild
                        >
                            <a
                                href={`${import.meta.env.VITE_API_URL}${memorial.file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Download Memorial"
                            >
                                <Download className="h-4 w-4 text-gray-600" />
                            </a>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamMemorials;
