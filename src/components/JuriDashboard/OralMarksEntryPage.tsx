"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, RefreshCw, Save } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams, useLocation } from "react-router-dom"
import useSubmitOralMarks from "@/hooks/useSubmitOralMarks"
import useGetOralMarks from "@/hooks/useGetOralMarks"
import MemorialUploadSkeleton from "@/components/skeleton/TeamDashboard/MemorialUploadSkeleton"
import useJuryRounds from "@/hooks/useJuryRounds"

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
  const state = {}
  markingCriteria.forEach((criterion) => {
    state[criterion.id] = ""
  })
  state["overall_comments"] = ""
  return state
}

const TeamMarksEntry = ({ team, scores, handleScoreChange, totalMaxScore }) => {
  if (!team) return null

  const totalScore = markingCriteria.reduce((total, key) => {
    const value = Number(scores[key.id])
    return total + (isNaN(value) ? 0 : value)
  }, 0)

  return (
    <Card className="shadow-sm flex-1">
      <CardContent className="p-6 space-y-6">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">{team.team_representative_name}</h2>
          <p className="text-sm text-gray-500">{team.team_id}</p>
        </div>

        {markingCriteria.map((criterion) => (
          <div key={criterion.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-900 text-lg">{criterion.name}</h3>
              </div>
              <div className="flex items-center gap-2 sm:w-40">
                <Input
                  type="number"
                  min="0"
                  max={criterion.max_points}
                  placeholder="0"
                  className="w-full text-right font-medium"
                  value={scores[criterion.id] || ""}
                  onChange={(e) => handleScoreChange(criterion.id, e.target.value)}
                />
                <span className="text-sm text-gray-500 whitespace-nowrap">/ {criterion.max_points}</span>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4">
          <h3 className="font-semibold text-gray-900 text-lg mb-2">Overall Comments</h3>
          <Textarea
            placeholder="Provide constructive feedback..."
            className="min-h-[120px] text-sm"
            value={scores["overall_comments"] || ""}
            onChange={(e) => handleScoreChange("overall_comments", e.target.value)}
          />
        </div>
        
        <div className="text-center font-bold text-lg">
            Total: {totalScore} / {totalMaxScore}
        </div>
      </CardContent>
    </Card>
  )
}

const OralMarksEntryPage = () => {
  const [searchParams] = useSearchParams()
  const roundId = searchParams.get("roundId")
  const teamCode = searchParams.get("teamCode")
  const location = useLocation()

  const [round, setRound] = useState(location.state?.round)
  const [isLoading, setIsLoading] = useState(!round)
  const [error, setError] = useState(null)

  const { juryRounds, isLoading: isLoadingRounds, error: roundsError } = useJuryRounds(teamCode)

  useEffect(() => {
    if (round) {
      setIsLoading(false)
      return
    }
    if (isLoadingRounds) return

    if (roundsError) {
      setError(roundsError.message)
      setIsLoading(false)
      return
    }
    
    if (juryRounds) {
      const foundRound = juryRounds.find(r => r.id.toString() === roundId)
      if (foundRound) {
        setRound(foundRound)
      } else {
        setError(`Round with ID ${roundId} not found.`)
      }
      setIsLoading(false)
    }
  }, [round, roundId, juryRounds, isLoadingRounds, roundsError])

  const [scoresTeam1, setScoresTeam1] = useState(initialScoresState())
  const [scoresTeam2, setScoresTeam2] = useState(initialScoresState())

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

  const [juryId, setJuryId] = useState < number | null > (getJuryId())

  const team1 = round?.team1
  const team2 = round?.team2

  const { oralMarks: existingMarksTeam1, isLoading: isLoadingMarksTeam1 } = useGetOralMarks(team1?.team_id, roundId ? parseInt(roundId) : null, juryId)
  const { oralMarks: existingMarksTeam2, isLoading: isLoadingMarksTeam2 } = useGetOralMarks(team2?.team_id, roundId ? parseInt(roundId) : null, juryId)
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

  const handleScoreChangeTeam1 = (field, value) => {
    if (field === 'overall_comments') {
      setScoresTeam1((prev) => ({ ...prev, [field]: value }))
      return
    }

    const criterion = markingCriteria.find(c => c.id === field)
    if (!criterion) {
      setScoresTeam1((prev) => ({ ...prev, [field]: value }))
      return
    }

    if (value === "") {
      setScoresTeam1((prev) => ({ ...prev, [field]: value }))
      return
    }

    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      return
    }

    const clamped = Math.max(0, Math.min(criterion.max_points, numValue))
    setScoresTeam1((prev) => ({ ...prev, [field]: clamped.toString() }))
  }

  const handleScoreChangeTeam2 = (field, value) => {
    if (field === 'overall_comments') {
      setScoresTeam2((prev) => ({ ...prev, [field]: value }))
      return
    }

    const criterion = markingCriteria.find(c => c.id === field)
    if (!criterion) {
      setScoresTeam2((prev) => ({ ...prev, [field]: value }))
      return
    }

    if (value === "") {
      setScoresTeam2((prev) => ({ ...prev, [field]: value }))
      return
    }

    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      return
    }

    const clamped = Math.max(0, Math.min(criterion.max_points, numValue))
    setScoresTeam2((prev) => ({ ...prev, [field]: clamped.toString() }))
  }

  const handleSubmit = async () => {
    if (!roundId || !juryId || !team1 || !team2) {
      alert("Round ID, Jury ID, or team information is missing.")
      return
    }

    const processScores = (scores) => {
        const processed = { ...scores }
        Object.keys(initialScoresState()).filter(k => k !== 'overall_comments').forEach(key => {
            if (processed[key] === '' || processed[key] === null || processed[key] === undefined) {
                processed[key] = 0
            }
        })
        return processed
    }

    const marksDataTeam1 = { ...processScores(scoresTeam1), team_id: team1.team_id, round_id: parseInt(roundId), jury_id: juryId }
    const marksDataTeam2 = { ...processScores(scoresTeam2), team_id: team2.team_id, round_id: parseInt(roundId), jury_id: juryId }

    await submitOralMarks(marksDataTeam1, existingMarksTeam1?.id || null)
    await submitOralMarks(marksDataTeam2, existingMarksTeam2?.id || null)
  }

  const handleReset = () => {
    setScoresTeam1(initialScoresState())
    setScoresTeam2(initialScoresState())
  }

  const handleGoBack = () => {
    window.history.back()
  }

  if (isLoading || isLoadingMarksTeam1 || isLoadingMarksTeam2) {
    return <MemorialUploadSkeleton />
  }

  if (error) {
    return <div className="text-center py-8 text-red-500"><p>{error}</p></div>
  }

  if (!round) {
    return <div className="text-center py-8 text-red-500"><p>Could not load round details.</p></div>
  }

  const totalMaxScore = markingCriteria.reduce((sum, criterion) => sum + criterion.max_points, 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="relative bg-[#2d4817] rounded-xl shadow-lg overflow-hidden p-6 text-white">
          <Button variant="ghost" size="icon" className="absolute top-4 left-4 text-white hover:bg-white/10 hover:text-white rounded-full" onClick={handleGoBack}>
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Oral Marks Entry</h1>
            <div className="inline-flex items-center bg-white/10 px-4 py-1.5 rounded-full">
              <span className="text-sm font-medium">Round: {round?.round_name || roundId}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <TeamMarksEntry team={team1} scores={scoresTeam1} handleScoreChange={handleScoreChangeTeam1} totalMaxScore={totalMaxScore} />
          <TeamMarksEntry team={team2} scores={scoresTeam2} handleScoreChange={handleScoreChangeTeam2} totalMaxScore={totalMaxScore} />
        </div>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:justify-end md:items-center gap-6">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={handleReset} disabled={isSubmitting} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Reset All Scores
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#2d4817] hover:bg-[#2d4817] gap-2">
                  {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {existingMarksTeam1 || existingMarksTeam2 ? 'Update Scores' : 'Submit Scores'}
                </Button>
              </div>
            </div>
            {(submitMessage || submitError) && (
              <div className={`mt-4 p-3 rounded-md text-center text-sm ${submitError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                {submitMessage || submitError}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OralMarksEntryPage
