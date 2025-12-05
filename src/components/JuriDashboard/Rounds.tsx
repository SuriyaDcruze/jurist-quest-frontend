import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Calendar, MapPin, Video, Eye, Clock, Trophy, Target } from "lucide-react"
import useJuryOwnRounds, { Round } from "@/hooks/useJuryOwnRounds"
import RoundDetailsDialog from "./RoundDetailsDialog"

const JuryRounds = () => {
    const navigate = useNavigate()
    const { rounds, isLoading, error } = useJuryOwnRounds()
    const [selectedRound, setSelectedRound] = useState<Round | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [ongoingRounds, setOngoingRounds] = useState<Round[]>([])
    const [upcomingRounds, setUpcomingRounds] = useState<Round[]>([])
    const [completedRounds, setCompletedRounds] = useState<Round[]>([])

    // Get jury ID from localStorage
    const getJuryId = () => {
        const juryDetails = localStorage.getItem("jury_details")
        if (juryDetails) {
            try {
                const parsedDetails = JSON.parse(juryDetails)
                return Array.isArray(parsedDetails) && parsedDetails.length > 0 ? parsedDetails[0].id : parsedDetails.id
            } catch (e) {
                console.error("Failed to parse jury_details from localStorage", e)
                return null
            }
        }
        return null
    }

    const juryId = getJuryId()

    useEffect(() => {
        if (rounds) {
            const ongoing = rounds.filter((r: Round) => r.status === 'ongoing')
            const upcoming = rounds.filter((r: Round) => r.status === 'upcoming')
            const completed = rounds.filter((r: Round) => r.status !== 'ongoing' && r.status !== 'upcoming')

            setOngoingRounds(ongoing)
            setUpcomingRounds(upcoming)
            setCompletedRounds(completed)
        }
    }, [rounds])

    const handleViewDetails = (round: Round) => {
        setSelectedRound(round)
        setIsDialogOpen(true)
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            upcoming: { color: 'bg-blue-100 text-blue-800', icon: Clock },
            ongoing: { color: 'bg-orange-100 text-orange-800', icon: Target },
            completed: { color: 'bg-green-100 text-green-800', icon: Trophy },
            evaluating: { color: 'bg-purple-100 text-purple-800', icon: Trophy },
        }
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming
        const Icon = config.icon

        return (
            <Badge className={`${config.color} flex items-center gap-1 w-fit`}>
                <Icon className="h-3 w-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        )
    }

    if (isLoading) {
        return <div className="p-6">Loading rounds...</div>
    }

    if (error) {
        return <div className="text-red-500 p-6">Error loading rounds</div>
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Ongoing</p>
                                <p className="text-3xl font-bold text-gray-900">{ongoingRounds.length}</p>
                            </div>
                            <Target className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                                <p className="text-3xl font-bold text-gray-900">{upcomingRounds.length}</p>
                            </div>
                            <Clock className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-3xl font-bold text-gray-900">{completedRounds.length}</p>
                            </div>
                            <Trophy className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Rounds Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Your Assigned Rounds</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Desktop View */}
                    <div className="hidden md:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Round</TableHead>
                                    <TableHead>Teams</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rounds.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-gray-500">
                                            No rounds assigned yet
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rounds.map((round: Round) => (
                                        <TableRow key={round.id}>
                                            <TableCell className="font-medium">{round.round_name}</TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold">{round.team1?.team_id}</p>
                                                    <p className="text-xs text-gray-500">vs</p>
                                                    <p className="text-sm font-semibold">{round.team2?.team_id}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm">{round.date}</p>
                                                        <p className="text-xs text-gray-500">{round.time}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {round.round_type === 'online' ? (
                                                        <>
                                                            <Video className="h-4 w-4 text-blue-500" />
                                                            <span className="text-sm">Online</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MapPin className="h-4 w-4 text-green-500" />
                                                            <span className="text-sm">Offline</span>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(round.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(round)}
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4">
                        {rounds.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                No rounds assigned yet
                            </div>
                        ) : (
                            rounds.map((round: Round) => (
                                <div key={round.id} className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg">{round.round_name}</h3>
                                            <div className="mt-1">
                                                {getStatusBadge(round.status)}
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDetails(round)}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Details
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="h-4 w-4" />
                                            <span>{round.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="h-4 w-4" />
                                            <span>{round.time}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{round.team1?.team_id || 'TBD'}</span>
                                            <span className="text-gray-400 text-xs">VS</span>
                                            <span className="font-medium">{round.team2?.team_id || 'TBD'}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            {round.round_type === 'online' ? (
                                                <>
                                                    <Video className="h-3 w-3" />
                                                    Online
                                                </>
                                            ) : (
                                                <>
                                                    <MapPin className="h-3 w-3" />
                                                    Offline
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Round Details Dialog */}
            <RoundDetailsDialog
                round={selectedRound}
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                juryId={juryId}
            />
        </div>
    )
}

export default JuryRounds
