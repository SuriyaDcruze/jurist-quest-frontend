"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, School, AlertCircle, Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import OverviewSkeleton from "@/components/skeleton/TeamDashboard/OverviewSkeleton"
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line
} from 'recharts';

interface Participant {
  name: string
}

interface TeamDetails {
  team_code: string
  team_name: string
  university: string
  participants: Participant[]
}

interface CurrentRound {
  round_name: string
  status: string | null
  finish_time: string | null
}

interface NextUpcomingRound {
  round_name: string
  date: string | null
  time: string | null
}

interface CompetitionProgress {
  current_round: CurrentRound
  next_upcoming_round: NextUpcomingRound
  last_round_status: string | null
  total_rounds: number
  upcoming_rounds: number
  ongoing_rounds: number
}

interface UpcomingDeadline {
  title: string
  deadline: string
}

interface OverviewData {
  team_details: TeamDetails
  competition_progress: CompetitionProgress
  upcoming_deadline: UpcomingDeadline
}

interface OverviewProps {
  overviewData: OverviewData | null
}

const Overview = ({ overviewData }: OverviewProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [countdownLabel, setCountdownLabel] = useState("Competition starts in")
  const [countdownSubLabel, setCountdownSubLabel] = useState("at 26th November 2025")

  useEffect(() => {
    let targetDate = new Date("2025-11-26T00:00:00");
    let label = "Competition starts in";
    let subLabel = "at 26th November 2025";

    if (overviewData?.competition_progress) {
        const { current_round, next_upcoming_round } = overviewData.competition_progress;
        if (current_round.finish_time) {
            targetDate = new Date(current_round.finish_time);
            label = "Current round ends in";
            subLabel = `at ${targetDate.toLocaleString()}`;
        } else if (next_upcoming_round.date && next_upcoming_round.time) {
            targetDate = new Date(`${next_upcoming_round.date}T${next_upcoming_round.time}`);
            label = "Next round starts in";
            subLabel = `at ${targetDate.toLocaleString()}`;
        }
    }

    setCountdownLabel(label);
    setCountdownSubLabel(subLabel);

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 }

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      }
      setTimeLeft(newTimeLeft)
    }

    calculateTimeLeft()

    const timer = setInterval(() => {
      calculateTimeLeft()
    }, 1000)

    return () => clearInterval(timer)
  }, [overviewData])

  if (!overviewData) {
    return <OverviewSkeleton />
  }

  const { team_details, competition_progress, upcoming_deadline } = overviewData

  let daysUntilDeadline = 0;
  let showDeadlineCard = false;
  if (upcoming_deadline && upcoming_deadline.deadline) {
    const deadlineDate = new Date(upcoming_deadline.deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    if (diffTime > 0) {
      showDeadlineCard = true;
      daysUntilDeadline = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }

  const chartData = [
    { name: 'Total Rounds', value: competition_progress.total_rounds },
    { name: 'Upcoming Rounds', value: competition_progress.upcoming_rounds },
    { name: 'Ongoing Rounds', value: competition_progress.ongoing_rounds },
  ];

  // Helper function to format date with ordinal suffix
  const formatDateWithOrdinal = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const ordinal = (day: number): string => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    return `${day}${ordinal(day)} ${month} ${year}`;
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Welcome Card */}
      <Card className="bg-[#2d4817] text-white border-0 shadow-lg">
        <CardContent className="p-4 md:p-6">
          {/* Top Section - Responsive Layout */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-3">Welcome Back!</h1>
              <p className="text-green-100 text-sm md:text-base mb-4">
                Welcome to your JuristQuest 2025 Participant Dashboard. Track your team’s progress, view important deadlines, and stay updated throughout the competition.
              </p>
            </div>

            {/* Countdown Timer - Responsive Styling */}
            <div className="bg-white text-gray-900 border border-[#2d4817] rounded-lg p-3 md:p-4 text-center w-full md:w-auto">
              <p className="text-xs md:text-sm text-gray-900 mb-1">{countdownLabel}</p>
              <div className="bg-[#2d4817] text-white rounded-md p-2 mb-2 inline-block min-w-[120px] md:min-w-[160px]">
                <div className="text-2xl md:text-4xl font-bold flex flex-wrap justify-center gap-1 md:gap-2">
                  <span className="text-xs md:text-base md:font-normal block w-full md:hidden">Time Left:</span>
                  <span>{timeLeft.days.toString().padStart(2, "0")}D</span>
                  <span>{timeLeft.hours.toString().padStart(2, "0")}H</span>
                  <span>{timeLeft.minutes.toString().padStart(2, "0")}M</span>
                  <span>{timeLeft.seconds.toString().padStart(2, "0")}S</span>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-900">{countdownSubLabel}</p>
            </div>
          </div>

          {/* Progress Cards - Responsive Grid */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-3 text-white">Your Competition Progress</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {/* Current Round Card */}
              <div className="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#2d4817] rounded flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm md:text-lg font-bold text-gray-900">Current Round</div>
                  </div>
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  {competition_progress.current_round.round_name}
                </div>
                {competition_progress.current_round.finish_time && (
                  <div className="text-xs text-gray-500 mt-1">
                    Finishes at: {new Date(competition_progress.current_round.finish_time).toLocaleString()}
                  </div>
                )}
              </div>

              {/* Next Upcoming Round Card */}
              <div className="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#2d4817] rounded flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm md:text-lg font-bold text-gray-900">Next Upcoming Round</div>
                  </div>
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  {competition_progress.next_upcoming_round.round_name}
                </div>
                {competition_progress.next_upcoming_round.date && (
                  <div className="text-xs text-gray-500 mt-1">
                    Date: {new Date(competition_progress.next_upcoming_round.date).toLocaleDateString()}
                    {competition_progress.next_upcoming_round.time &&
                      ` at ${competition_progress.next_upcoming_round.time.substring(0, 5)} `}
                  </div>
                )}
              </div>

              {/* Last Round Status Card */}
              <div className="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#2d4817] rounded flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm md:text-lg font-bold text-gray-900">Last Round Status</div>
                  </div>
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  {competition_progress.last_round_status || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadline Alert - Responsive */}
      {showDeadlineCard && (
        <Card className="border-red-200 bg-red-50 shadow-sm">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-start gap-2 md:gap-3">
              <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 text-sm md:text-base">Upcoming Deadline</h3>
                <p className="text-xs md:text-sm text-red-600">
                  {upcoming_deadline.title} submission deadline is in {daysUntilDeadline} days (
                  {formatDateWithOrdinal(new Date(upcoming_deadline.deadline))})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Info Cards - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Team Card */}
        <Card className="shadow-sm">
          <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center border border-[#2d4817] mb-2 md:mb-3">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-[#2d4817]" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm md:text-base">Team</h3>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              {team_details.team_code} ({team_details.team_name})
            </p>
          </CardContent>
        </Card>

        {/* University Card */}
        <Card className="shadow-sm">
          <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center border border-[#2d4817] mb-2 md:mb-3">
              <School className="h-5 w-5 md:h-6 md:w-6 text-[#2d4817]" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm md:text-base">University</h3>
            <p className="text-xs md:text-sm text-gray-600 mt-1">{team_details.university}</p>
          </CardContent>
        </Card>

        {/* Team Members Card */}
        <Card className="shadow-sm md:col-span-2 lg:col-span-1">
          <CardContent className="p-4 md:p-6">
            <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-center text-sm md:text-base">Team Members</h3>
            <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
              {team_details.participants.map((participant, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#2d4817] text-white flex items-center justify-center text-lg md:text-xl font-semibold border-2 border-[#2d4817] mb-1 md:mb-2">
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-xs text-gray-600 max-w-[70px] md:max-w-none truncate">{participant.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold mb-3 text-gray-900">Competition Statistics</h3>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 15,
                  left: 0,
                  bottom: 5,
                }}
              >
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2d4817" 
                  activeDot={{ r: 6 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Overview
