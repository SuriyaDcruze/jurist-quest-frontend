import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Target, Trophy, Eye } from "lucide-react"
import useJuryOwnRounds, { Round } from "@/hooks/useJuryOwnRounds"
import RoundDetailsDialog from "./RoundDetailsDialog"

const JuryCalendar = () => {
    const { rounds, isLoading, error } = useJuryOwnRounds()
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [selectedDateRounds, setSelectedDateRounds] = useState<Round[]>([])
    const [selectedRound, setSelectedRound] = useState<Round | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

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

    // Update selected date rounds when date changes or rounds load
    useEffect(() => {
        if (rounds && date) {
            const roundsOnDate = rounds.filter((round: Round) => {
                const roundDate = new Date(round.date)
                return (
                    roundDate.getDate() === date.getDate() &&
                    roundDate.getMonth() === date.getMonth() &&
                    roundDate.getFullYear() === date.getFullYear()
                )
            })
            setSelectedDateRounds(roundsOnDate)
        }
    }, [rounds, date])

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

    // Function to check if a date has rounds (for highlighting)
    const hasRounds = (day: Date) => {
        if (!rounds) return false
        return rounds.some((round: Round) => {
            const roundDate = new Date(round.date)
            return (
                roundDate.getDate() === day.getDate() &&
                roundDate.getMonth() === day.getMonth() &&
                roundDate.getFullYear() === day.getFullYear()
            )
        })
    }

    if (isLoading) return <div className="p-6">Loading calendar...</div>
    if (error) return <div className="p-6 text-red-500">Error loading calendar</div>

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Card */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Round Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                            modifiers={{
                                hasRound: (date) => hasRounds(date),
                            }}
                            modifiersStyles={{
                                hasRound: {
                                    fontWeight: 'bold',
                                    textDecoration: 'underline',
                                    color: '#2d4817'
                                }
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Rounds List for Selected Date */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>
                            Rounds for {date?.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedDateRounds.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>No rounds scheduled for this date</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {selectedDateRounds.map((round) => (
                                    <div
                                        key={round.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-lg">{round.round_name}</h3>
                                                {getStatusBadge(round.status)}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {round.time} • {round.duration_in_minutes} mins • {round.round_type}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span>{round.team1?.team_id || 'TBD'}</span>
                                                <span className="font-bold">vs</span>
                                                <span>{round.team2?.team_id || 'TBD'}</span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => handleViewDetails(round)}
                                            className="bg-[#2d4817] hover:bg-[#1f3210]"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <RoundDetailsDialog
                round={selectedRound}
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                juryId={juryId}
            />
        </div>
    )
}

export default JuryCalendar
