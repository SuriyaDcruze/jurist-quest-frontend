import React, { useState } from 'react';
import { FileText, Download, Loader2, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import useJuryMemorials from "@/hooks/useJuryMemorials";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface TeamMemorialsProps {
    teamId: string;
}

const TeamMemorials: React.FC<TeamMemorialsProps> = ({ teamId }) => {
    const { juryMemorials, isLoading, error } = useJuryMemorials(teamId);
    const { toast } = useToast();
    const [viewingPdfUrl, setViewingPdfUrl] = useState<string | null>(null);
    const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
    const [loadingPdf, setLoadingPdf] = useState(false);

    const handleViewPdf = async (fileUrl: string) => {
        setLoadingPdf(true);
        setIsPdfViewerOpen(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(fileUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob'
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const objectUrl = URL.createObjectURL(blob);
            setViewingPdfUrl(objectUrl);
        } catch (error) {
            console.error('Error loading PDF:', error);
            toast({
                title: "Error",
                description: "Failed to load PDF file",
                variant: "destructive",
            });
            setIsPdfViewerOpen(false);
        } finally {
            setLoadingPdf(false);
        }
    };

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
        <>
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
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleViewPdf(`${import.meta.env.VITE_API_URL}${memorial.file}`)}
                                    title="View Memorial"
                                >
                                    <Eye className="h-4 w-4 text-gray-600" />
                                </Button>
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
                        </div>
                    ))}
                </div>
            </div>

            {/* PDF Viewer Dialog */}
            <Dialog open={isPdfViewerOpen} onOpenChange={(open) => {
                setIsPdfViewerOpen(open);
                if (!open && viewingPdfUrl) {
                    // Cleanup object URL when dialog closes
                    URL.revokeObjectURL(viewingPdfUrl);
                    setViewingPdfUrl(null);
                }
            }}>
                <DialogContent className="max-w-6xl max-h-[95vh] p-0">
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle>Memorial Document Viewer</DialogTitle>
                    </DialogHeader>
                    <div className="w-full h-[80vh] overflow-hidden bg-gray-100 flex items-center justify-center">
                        {loadingPdf ? (
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="h-8 w-8 animate-spin text-[#2d4817]" />
                                <p className="text-gray-600">Loading PDF...</p>
                            </div>
                        ) : viewingPdfUrl ? (
                            <embed
                                src={`${viewingPdfUrl}#toolbar=0`}
                                type="application/pdf"
                                className="w-full h-full"
                                title="PDF Viewer"
                            />
                        ) : (
                            <p className="text-gray-500">No document selected</p>
                        )}
                    </div>
                    <DialogFooter className="p-4 border-t">
                        <Button variant="outline" onClick={() => {
                            setIsPdfViewerOpen(false);
                            if (viewingPdfUrl) {
                                URL.revokeObjectURL(viewingPdfUrl);
                                setViewingPdfUrl(null);
                            }
                        }}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TeamMemorials;
