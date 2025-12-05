import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Video, Clock, Edit, Lock } from "lucide-react"
import { Round } from "@/hooks/useJuryOwnRounds"
import useGetOralMarks from "@/hooks/useGetOralMarks"
import OralMarksEntryForm from "./OralMarksEntryForm"
import TeamMemorials from "./TeamMemorials"

interface RoundDetailsDialogProps {
    round: Round | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    juryId: number | null
}

const RoundDetailsDialog = ({ round, isOpen, onOpenChange, juryId }: RoundDetailsDialogProps) => {
    const [viewMode, setViewMode] = useState<'details' | 'marks'>('details')

    // Check if marks exist for both teams
    const { oralMarks: marksTeam1, refetch: refetchTeam1 } = useGetOralMarks(
        round?.team1?.team_id || null,
        round?.id || null,
        juryId
    )
    const { oralMarks: marksTeam2, refetch: refetchTeam2 } = useGetOralMarks(
        round?.team2?.team_id || null,
        round?.id || null,
        juryId
    )

    if (!round) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) setViewMode('details')
            onOpenChange(open)
        }}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{round.round_name}</DialogTitle>
                    <DialogDescription>
                        {viewMode === 'marks'
                            ? 'Enter or edit oral marks for both teams'
                            : (round.status === 'upcoming'
                                ? 'Basic round information (Full details available after round starts)'
                                : 'Detailed information about this round')}
                    </DialogDescription>
                </DialogHeader>

                {viewMode === 'marks' && juryId ? (
                    <OralMarksEntryForm
                        round={round}
                        juryId={juryId}
                        onCancel={() => setViewMode('details')}
                        onSuccess={() => {
                            refetchTeam1()
                            refetchTeam2()
                            setViewMode('details')
                        }}
                    />
                ) : (
                    <div className="space-y-6">
                        {/* Quick Join Button for Ongoing Online Rounds */}
                        {round.status === 'ongoing' && round.round_type === 'online' && round.meet_url && (
                            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-500 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500 rounded-full animate-pulse">
                                            <Video className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-green-900">Round is Live!</p>
                                            <p className="text-sm text-green-700">Click to join the meeting now</p>
                                        </div>
                                    </div>
                                    <a
                                        href={round.meet_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-lg"
                                    >
                                        <Video className="h-5 w-5" />
                                        Join Meeting
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Enter Marks Button - Top Position for Ongoing/Completed Rounds */}
                        {round.status !== 'upcoming' && (
                            (() => {
                                const marksExist = marksTeam1 || marksTeam2
                                const isCompleted = !['upcoming', 'ongoing'].includes(round.status)
                                const canEdit = !isCompleted || !marksExist

                                if (!canEdit) {
                                    // Marks already submitted for completed round - show locked state
                                    return (
                                        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gray-400 rounded-full">
                                                        <Lock className="h-6 w-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-700">Marks Submitted</p>
                                                        <p className="text-sm text-gray-600">Marks have been finalized for this round</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    disabled
                                                    className="bg-gray-400 text-white font-semibold px-6 py-3 flex items-center gap-2 cursor-not-allowed"
                                                >
                                                    <Lock className="h-5 w-5" />
                                                    Locked
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                }

                                // Can edit - show active button
                                return (
                                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-[#2d4817] rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-[#2d4817] rounded-full">
                                                    <Edit className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#2d4817]">Oral Marks Entry</p>
                                                    <p className="text-sm text-gray-700">
                                                        {marksExist ? 'Edit marks for both teams' : 'Enter marks for both teams'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => setViewMode('marks')}
                                                className="bg-[#2d4817] hover:bg-[#1f3210] text-white font-semibold px-6 py-3 flex items-center gap-2 shadow-lg"
                                            >
                                                <Edit className="h-5 w-5" />
                                                {marksExist ? 'Edit Marks' : 'Enter Marks'}
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })()
                        )}

                        {/* Round Info */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-sm font-semibold text-gray-600">Date & Time</p>
                                <p className="text-lg">{round.date} at {round.time}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600">Duration</p>
                                <p className="text-lg">{round.duration_in_minutes} minutes</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600">Type</p>
                                <p className="text-lg capitalize">{round.round_type}</p>
                            </div>
                            {['upcoming', 'ongoing'].includes(round.status) && (
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">Location</p>
                                    {round.round_type === 'online' ? (
                                        round.status === 'upcoming' ? (
                                            <p className="text-sm text-gray-500 italic">Meeting link available on round day</p>
                                        ) : (
                                            <a
                                                href={round.meet_url || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                Join Meeting
                                            </a>
                                        )
                                    ) : (
                                        <p className="text-lg">{round.venue}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Conditional Team Details - Only show for non-upcoming rounds */}
                        {round.status !== 'upcoming' ? (
                            <>
                                {/* Teams */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Team 1 */}
                                    <div className="p-4 border rounded-lg">
                                        <h3 className="font-bold text-lg mb-3 text-[#2d4817]">Team 1</h3>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-600">Team ID</p>
                                                <p className="font-semibold">{round.team1?.team_id}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-600">Institution</p>
                                                <p>{round.team1?.institution_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-600">Representative</p>
                                                <p>{round.team1?.team_representative_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-600">Speakers</p>
                                                <p className="text-sm">{round.team1?.speaker_1_name}</p>
                                                <p className="text-sm">{round.team1?.speaker_2_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-600">Researcher</p>
                                                <p className="text-sm">{round.team1?.researcher_name}</p>
                                            </div>
                                            {round.team1?.team_id && (
                                                <TeamMemorials teamId={round.team1.team_id} />
                                            )}
                                        </div>
                                    </div>

                                    {/* Team 2 */}
                                    <div className="p-4 border rounded-lg">
                                        <h3 className="font-bold text-lg mb-3 text-[#2d4817]">Team 2</h3>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-600">Team ID</p>
                                                <p className="font-semibold">{round.team2?.team_id}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-600">Institution</p>
                                                <p>{round.team2?.institution_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-600">Representative</p>
                                                <p>{round.team2?.team_representative_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-600">Speakers</p>
                                                <p className="text-sm">{round.team2?.speaker_1_name}</p>
                                                <p className="text-sm">{round.team2?.speaker_2_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-600">Researcher</p>
                                                <p className="text-sm">{round.team2?.researcher_name}</p>
                                            </div>
                                            {round.team2?.team_id && (
                                                <TeamMemorials teamId={round.team2.team_id} />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Winner */}
                                {round.winner && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm font-semibold text-green-800">Winner</p>
                                        <p className="text-lg font-bold text-green-900">
                                            {round.winner === round.team1?.id
                                                ? round.team1?.team_id
                                                : round.team2?.team_id}
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Upcoming Round - Limited Info */
                            <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <Clock className="h-6 w-6 text-blue-600" />
                                    <p className="text-lg font-semibold text-blue-900">Upcoming Round</p>
                                </div>
                                <p className="text-sm text-blue-700">
                                    Team details will be available once the round begins.
                                </p>
                                <p className="text-xs text-blue-600 mt-2">
                                    Please check back on {round.date} at {round.time}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default RoundDetailsDialog
