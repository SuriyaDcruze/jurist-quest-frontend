"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RefreshCw, Save, ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import useSubmitOralMarks from "@/hooks/useSubmitOralMarks"
import useGetOralMarks from "@/hooks/useGetOralMarks"
import { Round } from "@/hooks/useJuryOwnRounds"

// Marking criteria
const markingCriteria = [
    { id: "knowledge_of_law", name: "Knowledge of Law", max_points: 25 },
    { id: "application_of_law_to_facts", name: "Application of Law to Facts", max_points: 20 },
    { id: "ingenuity_and_ability_to_answer_questions", name: "Ingenuity and Ability to answer Questions", max_points: 15 },
    { id: "persuasiveness", name: "Persuasiveness", max_points: 10 },
    { id: "time_management_and_organization", name: "Time Management and Organization", max_points: 10 },
    { id: "style_poise_courtesy_and_demeanor", name: "Style, Poise, Courtesy and Demeanor", max_points: 10 },
    { id: "language_and_presentation", name: "Language and Presentation", max_points: 10 },
]

const initialScoresState = () => {
    const state: any = {}
    markingCriteria.forEach((criterion) => {
        state[criterion.id] = ""
    })
    state["overall_comments"] = ""
    return state
}

const TeamMarksEntry = ({ team, scores, handleScoreChange, totalMaxScore }: any) => {
    if (!team) return null

    const totalScore = markingCriteria.reduce((total, key) => {
        const value = Number(scores[key.id])
        return total + (isNaN(value) ? 0 : value)
    }, 0)

    return (
        <Card className="shadow-sm flex-1 border-gray-200">
            <CardContent className="p-6 space-y-6">
                <div className="text-center mb-4 p-4 bg-gray-50 rounded-lg">
                    <h2 className="text-xl font-bold text-[#2d4817]">{team.team_representative_name}</h2>
                    <p className="text-sm text-gray-500 font-semibold">{team.team_id}</p>
                    <p className="text-xs text-gray-400">{team.institution_name}</p>
                </div>

                {markingCriteria.map((criterion) => (
                    <div key={criterion.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-gray-700 text-sm">{criterion.name}</h3>
                                <span className="text-xs text-gray-400 font-medium">Max: {criterion.max_points}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min="0"
                                    max={criterion.max_points}
                                    placeholder="0"
                                    className="w-full text-right font-medium border-gray-200 focus:border-[#2d4817] focus:ring-[#2d4817]"
                                    value={scores[criterion.id] || ""}
                                    onChange={(e) => handleScoreChange(criterion.id, e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="pt-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">Overall Comments</h3>
                    <Textarea
                        placeholder="Provide constructive feedback..."
                        className="min-h-[100px] text-sm border-gray-200 focus:border-[#2d4817] focus:ring-[#2d4817]"
                        value={scores["overall_comments"] || ""}
                        onChange={(e) => handleScoreChange("overall_comments", e.target.value)}
                    />
                </div>

                <div className="text-center font-bold text-lg p-3 bg-gray-50 rounded-lg text-[#2d4817]">
                    Total: {totalScore} / {totalMaxScore}
                </div>
            </CardContent>
        </Card>
    )
}

interface OralMarksEntryFormProps {
    round: Round
    juryId: number
    onCancel: () => void
    onSuccess: () => void
}

const OralMarksEntryForm = ({ round, juryId, onCancel, onSuccess }: OralMarksEntryFormProps) => {
    const [scoresTeam1, setScoresTeam1] = useState(initialScoresState())
    const [scoresTeam2, setScoresTeam2] = useState(initialScoresState())

    const team1 = round.team1
    const team2 = round.team2

    const { oralMarks: existingMarksTeam1, isLoading: isLoadingMarksTeam1 } = useGetOralMarks(team1?.team_id, round.id, juryId)
    const { oralMarks: existingMarksTeam2, isLoading: isLoadingMarksTeam2 } = useGetOralMarks(team2?.team_id, round.id, juryId)
    const { isSubmitting, submitMessage, error: submitError, submitOralMarks } = useSubmitOralMarks()

    useEffect(() => {
        if (existingMarksTeam1) {
            setScoresTeam1({ ...initialScoresState(), ...existingMarksTeam1 })
        }
    }, [existingMarksTeam1])

    useEffect(() => {
        if (existingMarksTeam2) {
            setScoresTeam2({ ...initialScoresState(), ...existingMarksTeam2 })
        }
    }, [existingMarksTeam2])

    const handleScoreChange = (setScores: any) => (field: string, value: string) => {
        if (field === 'overall_comments') {
            setScores((prev: any) => ({ ...prev, [field]: value }))
            return
        }

        const criterion = markingCriteria.find(c => c.id === field)
        if (!criterion) {
            setScores((prev: any) => ({ ...prev, [field]: value }))
            return
        }

        if (value === "") {
            setScores((prev: any) => ({ ...prev, [field]: value }))
            return
        }

        const numValue = parseFloat(value)
        if (isNaN(numValue)) {
            return
        }

        const clamped = Math.max(0, Math.min(criterion.max_points, numValue))
        setScores((prev: any) => ({ ...prev, [field]: clamped.toString() }))
    }

    const handleSubmit = async () => {
        if (!round.id || !juryId || !team1 || !team2) {
            alert("Round ID, Jury ID, or team information is missing.")
            return
        }

        const processScores = (scores: any) => {
            const processed = { ...scores }
            Object.keys(initialScoresState()).filter(k => k !== 'overall_comments').forEach(key => {
                if (processed[key] === '' || processed[key] === null || processed[key] === undefined) {
                    processed[key] = 0
                }
            })
            return processed
        }

        const marksDataTeam1 = { ...processScores(scoresTeam1), team_id: team1.team_id, round_id: round.id, jury_id: juryId }
        const marksDataTeam2 = { ...processScores(scoresTeam2), team_id: team2.team_id, round_id: round.id, jury_id: juryId }

        await submitOralMarks(marksDataTeam1, existingMarksTeam1?.id || null)
        await submitOralMarks(marksDataTeam2, existingMarksTeam2?.id || null)

        // Call onSuccess after a short delay to allow the user to see the success message
        setTimeout(() => {
            onSuccess()
        }, 1500)
    }

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset all scores?")) {
            setScoresTeam1(initialScoresState())
            setScoresTeam2(initialScoresState())
        }
    }

    if (isLoadingMarksTeam1 || isLoadingMarksTeam2) {
        return <div className="p-8 text-center">Loading marks...</div>
    }

    const totalMaxScore = markingCriteria.reduce((sum, criterion) => sum + criterion.max_points, 0)
    const isRoundCompleted = round.status === 'completed' || round.status === 'evaluating'

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onCancel} className="gap-2 text-gray-600">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Details
                </Button>
                <div className="text-sm text-gray-500">
                    Round: <span className="font-semibold text-gray-900">{round.round_name}</span>
                </div>
            </div>

            {isRoundCompleted && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-full">
                            <RefreshCw className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="font-bold text-amber-800">Final Submission</p>
                            <p className="text-sm text-amber-700">
                                This round is marked as completed. Once you submit these marks, you will <strong>not</strong> be able to edit them again.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto p-1">
                <TeamMarksEntry
                    team={team1}
                    scores={scoresTeam1}
                    handleScoreChange={handleScoreChange(setScoresTeam1)}
                    totalMaxScore={totalMaxScore}
                />
                <TeamMarksEntry
                    team={team2}
                    scores={scoresTeam2}
                    handleScoreChange={handleScoreChange(setScoresTeam2)}
                    totalMaxScore={totalMaxScore}
                />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t">
                {(submitMessage || submitError) ? (
                    <div className={`px-4 py-2 rounded-md text-sm font-medium ${submitError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                        {submitMessage || submitError}
                    </div>
                ) : <div></div>}

                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleReset} disabled={isSubmitting} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Reset
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#2d4817] hover:bg-[#1f3210] gap-2 text-white">
                        {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {existingMarksTeam1 || existingMarksTeam2 ? 'Update Scores' : 'Submit Scores'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default OralMarksEntryForm
