"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Info, Users, Swords, Calendar as CalendarIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import useJuryTeams from "@/hooks/useJuryTeams"
import TeamCardSkeleton from "@/components/skeleton/TeamDashboard/TeamCardSkeleton"
import { useEffect, useState } from "react"
import axios from "axios"
import { format } from "date-fns"
import Calendar from 'react-calendar';
import type { Value } from 'react-calendar';

// Interface for TeamCard props
interface TeamCardProps {
  teamCode: string
  teamName: string
  university: string
  representative: string
  speaker1: string
  speaker2: string
  researcher: string
  opponent?: {
    team_id: string
    team_representative_name: string
    roundName: string
  }
}

// TeamCard Component
function TeamCard({ teamCode, teamName, university, representative, speaker1, speaker2, researcher, opponent }: TeamCardProps) {
  // Helper function to get initial for avatar
  const getInitial = (name: string) => name.charAt(0).toUpperCase()

  // Combine members into an array for easier mapping
  const teamMembers = [
    { name: representative, role: "Representative" },
    { name: speaker1, role: "Speaker 1" },
    { name: speaker2, role: "Speaker 2" },
    { name: researcher, role: "Researcher" },
  ]

  return (
    <Card
      className="shadow-sm hover:shadow-md transition-all duration-300 border-2 border-[#2d4817] rounded-lg"
    >
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-[#2d4817] mb-3">
          <Users className="h-6 w-6 text-[#2d4817]" />
        </div>

        <p className="text-sm font-medium text-gray-900 dark:text-gray-50 mb-2">
          {teamCode} ({teamName})
        </p>

        <div className="mt-4 w-full border-t pt-4 space-y-3">
          <div className="text-left">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">University</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{university}</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Team Members</p>
            <div className="grid grid-cols-2 gap-2">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Avatar className="w-6 h-6 bg-[#2d4817] text-white font-semibold text-xs">
                    <AvatarFallback>{getInitial(member.name)}</AvatarFallback>
                  </Avatar>
                  <p className="text-xs text-gray-600 dark:text-gray-100">{member.name}</p>
                </div>
              ))}
            </div>
          </div>

          {opponent && (
            <div className="mt-4 pt-4 border-t border-dashed text-left">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <Swords className="h-4 w-4" />
                    <span>Opponent in {opponent.roundName}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{opponent.team_representative_name} ({opponent.team_id})</p>
            </div>
          )}

          <div className="flex justify-center gap-2 mt-2">
           <Button
              onClick={(e) => {
                e.stopPropagation()
                // Add functionality for Memorial button
                window.location.href = `/juri-dashboard/memorial?teamCode=${teamCode}`
              }}
              className="bg-green-900 hover:bg-green-800 text-white"
            >
              Memorial
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                // Add functionality for Rounds button
                window.location.href = `/juri-dashboard/round?teamCode=${teamCode}`
              }}
              className="bg-green-900 hover:bg-green-800 text-white"
            >
              Rounds
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Team Component
const Team = () => {
  const { juryTeams, isLoading, error } = useJuryTeams();
  const [rounds, setRounds] = useState([]);
  const [isLoadingRounds, setIsLoadingRounds] = useState(true);
  const [upcomingRounds, setUpcomingRounds] = useState([]);
  const [isLoadingUpcomingRounds, setIsLoadingUpcomingRounds] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const apiUrl = import.meta.env.VITE_API_URL;

    if (juryTeams && juryTeams.length > 0) {
        setIsLoadingRounds(true);
        Promise.all(juryTeams.map(team =>
            axios.get(`${apiUrl}/api/jury-rounds/${team.team_id}/`, {
                headers: { "Authorization": `Bearer ${accessToken}` }
            })
        )).then(responses => {
            const allRoundsRaw = responses.flatMap(res => res.data);
            const uniqueRounds = Array.from(new Map(allRoundsRaw.map(r => [r.id, r])).values());
            setRounds(uniqueRounds);
        }).catch(err => {
            console.error("Failed to fetch rounds for all teams", err);
        }).finally(() => {
            setIsLoadingRounds(false);
        });
    } else if (!isLoading) {
        setIsLoadingRounds(false);
    }

    // Always fetch upcoming rounds
    setIsLoadingUpcomingRounds(true);
    axios.get(`${apiUrl}/api/jury/teams/upcoming-rounds/`, {
        headers: { "Authorization": `Bearer ${accessToken}` }
    }).then(response => {
        setUpcomingRounds(response.data);
    }).catch(err => {
        console.error("Failed to fetch upcoming rounds", err);
    }).finally(() => {
        setIsLoadingUpcomingRounds(false);
    });
  }, [juryTeams, isLoading]);

  const pairings = {};
  for (const round of rounds) {
      if (round.team1 && round.team2) {
          pairings[round.team1.team_id] = { 
              team_id: round.team2.team_id,
              team_representative_name: round.team2.team_representative_name,
              roundName: round.round_name 
          };
          pairings[round.team2.team_id] = {
              team_id: round.team1.team_id,
              team_representative_name: round.team1.team_representative_name,
              roundName: round.round_name
          };
      }
  }

  if (isLoading || isLoadingRounds) {
    return (
      <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900 dark:text-gray-50">
          Current Teams
        </h1>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl">
          <TeamCardSkeleton />
          <TeamCardSkeleton />
          <TeamCardSkeleton />
          <TeamCardSkeleton />
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900 dark:text-gray-50">
          Current Teams
        </h1>
        <div className="text-center py-8 text-red-500">
          <p>{error.message}</p>
        </div>
      </main>
    );
  }

  if (juryTeams.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2d4817] to-[#2d4817] rounded-full mb-6 shadow-lg">
              <CalendarIcon className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Upcoming Rounds Calendar
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              View and manage your scheduled jury rounds with our comprehensive calendar system
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Calendar Section */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-[#2d4817] to-[#2d4817] p-6 rounded-t-lg">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <CalendarIcon className="h-6 w-6" />
                      Schedule Calendar
                    </h2>
                    <p className="text-green-100 mt-2">Click on any date to view scheduled rounds</p>
                  </div>
                  
                  <div className="p-8">
                    <style jsx global>{`
                      .react-calendar {
                        width: 100% !important;
                        background: transparent !important;
                        border: none !important;
                        font-family: inherit !important;
                        line-height: 1.25em !important;
                      }
                      
                      .react-calendar--selectRange .react-calendar__tile--hover {
                        background-color: #e6f3e6 !important;
                      }
                      
                      .react-calendar__navigation {
                        display: flex !important;
                        height: 60px !important;
                        margin-bottom: 1rem !important;
                        background: linear-gradient(135deg, #f8fffe 0%, #f0fdf4 100%) !important;
                        border-radius: 12px !important;
                        padding: 0 1rem !important;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
                      }
                      
                      .react-calendar__navigation button {
                        min-width: 44px !important;
                        background: none !important;
                        font-size: 18px !important;
                        font-weight: 600 !important;
                        color: #2d4817 !important;
                        border: none !important;
                        padding: 0.5rem !important;
                        border-radius: 8px !important;
                        transition: all 0.2s ease !important;
                      }
                      
                      .react-calendar__navigation button:hover,
                      .react-calendar__navigation button:focus {
                        background: #e6f3e6 !important;
                        color: #1a2f0f !important;
                        transform: translateY(-1px) !important;
                      }
                      
                      .react-calendar__navigation button:disabled {
                        background-color: transparent !important;
                        opacity: 0.5 !important;
                        cursor: not-allowed !important;
                      }
                      
                      .react-calendar__navigation__label {
                        font-size: 20px !important;
                        font-weight: 700 !important;
                        color: #2d4817 !important;
                        flex-grow: 1 !important;
                        text-align: center !important;
                      }
                      
                      .react-calendar__month-view__weekdays {
                        text-align: center !important;
                        text-transform: uppercase !important;
                        font-weight: 700 !important;
                        font-size: 0.75rem !important;
                        color: #6b7280 !important;
                        margin-bottom: 1rem !important;
                      }
                      
                      .react-calendar__month-view__weekdays__weekday {
                        padding: 0.75rem 0.25rem !important;
                        background: #f9fafb !important;
                        border-radius: 8px !important;
                        margin: 0 2px !important;
                      }
                      
                      .react-calendar__month-view__days {
                        display: grid !important;
                        grid-template-columns: repeat(7, 1fr) !important;
                        gap: 4px !important;
                      }
                      
                      .react-calendar__tile {
                        max-width: initial !important;
                        padding: 1rem 0.5rem !important;
                        background: #ffffff !important;
                        border: 2px solid #f3f4f6 !important;
                        border-radius: 12px !important;
                        font-weight: 600 !important;
                        color: #374151 !important;
                        position: relative !important;
                        transition: all 0.3s ease !important;
                        min-height: 60px !important;
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                        justify-content: center !important;
                        cursor: pointer !important;
                      }
                      
                      .react-calendar__tile:hover {
                        background: linear-gradient(135deg, #f0fdf4 0%, #e6f3e6 100%) !important;
                        border-color: #2d4817 !important;
                        transform: translateY(-2px) !important;
                        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15) !important;
                      }
                      
                      .react-calendar__tile--active {
                        background: linear-gradient(135deg, #2d4817 0%, #2d4817 100%) !important;
                        border-color: #2d4817 !important;
                        color: white !important;
                        box-shadow: 0 4px 16px rgba(45, 72, 23, 0.3) !important;
                      }
                      
                      .react-calendar__tile--active:hover {
                        background: linear-gradient(135deg, #45a049 0%, #1a2f0f 100%) !important;
                        transform: translateY(-1px) !important;
                      }
                      
                      .react-calendar__tile--now {
                        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%) !important;
                        border-color: #f59e0b !important;
                        color: #92400e !important;
                        font-weight: 700 !important;
                      }
                      
                      .react-calendar__tile--now:hover {
                        background: linear-gradient(135deg, #fde68a 0%, #fcd34d 100%) !important;
                      }
                      
                      .react-calendar__month-view__days__day--neighboringMonth {
                        color: #d1d5db !important;
                        background: #f9fafb !important;
                      }
                      
                      .react-calendar__month-view__days__day--weekend {
                        color: #dc2626 !important;
                      }
                      
                      .dark .react-calendar__tile {
                        background: #374151 !important;
                        border-color: #4b5563 !important;
                        color: #e5e7eb !important;
                      }
                      
                      .dark .react-calendar__tile:hover {
                        background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%) !important;
                        border-color: #2d4817 !important;
                      }
                      
                      .dark .react-calendar__navigation {
                        background: linear-gradient(135deg, #374151 0%, #4b5563 100%) !important;
                      }
                      
                      .dark .react-calendar__navigation button {
                        color: #e5e7eb !important;
                      }
                      
                      .dark .react-calendar__navigation__label {
                        color: #f3f4f6 !important;
                      }
                      
                      .dark .react-calendar__month-view__weekdays__weekday {
                        background: #4b5563 !important;
                        color: #9ca3af !important;
                      }
                    `}</style>
                    
                    <Calendar
                      onChange={setSelectedDate}
                      value={selectedDate}
                      className="w-full"
                      tileContent={({ date, view }) => {
                        if (view === 'month') {
                          const dayEvents = upcomingRounds.filter(round =>
                            new Date(`${round.date}T${round.time}`).toDateString() === date.toDateString()
                          );
                          return dayEvents.length > 0 ? (
                            <div className="absolute top-1 right-1">
                              <div className="bg-gradient-to-r from-[#2d4817] to-[#2d4817] rounded-full w-3 h-3 flex items-center justify-center">
                                <div className="bg-white rounded-full w-1.5 h-1.5"></div>
                              </div>
                            </div>
                          ) : null;
                        }
                        return null;
                      }}
                      tileClassName={({ date, view }) => {
                        if (view === 'month') {
                          const hasEvents = upcomingRounds.some(round =>
                            new Date(`${round.date}T${round.time}`).toDateString() === date.toDateString()
                          );
                          let classes = '';
                          if (hasEvents) {
                            classes += ' event-day';
                          }
                          return classes.trim();
                        }
                        return '';
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events Section */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-8">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-[#2d4817] to-[#2d4817] p-6 rounded-t-lg">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      {selectedDate ? format(new Date(selectedDate.toString()), 'MMM dd, yyyy') : 'Select a Date'}
                    </h3>
                    <p className="text-green-100 text-sm mt-1">Scheduled rounds for this date</p>
                  </div>
                  
                  <div className="p-6 max-h-96 overflow-y-auto">
                    {selectedDate && (
                      <>
                        {upcomingRounds.filter(round =>
                          new Date(`${round.date}T${round.time}`).toDateString() === new Date(selectedDate.toString()).toDateString()
                        ).length > 0 ? (
                          <div className="space-y-4">
                            {upcomingRounds.filter(round =>
                              new Date(`${round.date}T${round.time}`).toDateString() === new Date(selectedDate.toString()).toDateString()
                            ).map((round, index) => (
                              <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl border border-green-200 dark:border-gray-500 hover:shadow-md transition-all duration-200">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1">
                                      {round.round_name}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                      <Clock className="h-4 w-4" />
                                      {format(new Date(`${round.date}T${round.time}`), 'p')}
                                    </div>
                                  </div>
                                  <div className="bg-[#2d4817] text-white px-3 py-1 rounded-full text-xs font-semibold">
                                    Round
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                              <CalendarIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No rounds scheduled</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">for this date</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {upcomingRounds.length === 0 && !isLoadingUpcomingRounds && (
            <div className="text-center mt-12">
              <Card className="max-w-md mx-auto shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No Upcoming Rounds</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    There are no upcoming rounds assigned to you at the moment.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2d4817] to-[#2d4817] rounded-full mb-6 shadow-lg">
            <CalendarIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Upcoming Rounds Calendar
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            View and manage your scheduled jury rounds with our comprehensive calendar system
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-[#2d4817] to-[#2d4817] p-6 rounded-t-lg">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <CalendarIcon className="h-6 w-6" />
                    Schedule Calendar
                  </h2>
                  <p className="text-green-100 mt-2">Click on any date to view scheduled rounds</p>
                </div>
                
                <div className="p-8">
                  <style jsx global>{`
                    .react-calendar {
                      width: 100% !important;
                      background: transparent !important;
                      border: none !important;
                      font-family: inherit !important;
                      line-height: 1.25em !important;
                    }
                    
                    .react-calendar--selectRange .react-calendar__tile--hover {
                      background-color: #e6f3e6 !important;
                    }
                    
                    .react-calendar__navigation {
                      display: flex !important;
                      height: 60px !important;
                      margin-bottom: 1rem !important;
                      background: linear-gradient(135deg, #f8fffe 0%, #f0fdf4 100%) !important;
                      border-radius: 12px !important;
                      padding: 0 1rem !important;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
                    }
                    
                    .react-calendar__navigation button {
                      min-width: 44px !important;
                      background: none !important;
                      font-size: 18px !important;
                      font-weight: 600 !important;
                      color: #2d4817 !important;
                      border: none !important;
                      padding: 0.5rem !important;
                      border-radius: 8px !important;
                      transition: all 0.2s ease !important;
                    }
                    
                    .react-calendar__navigation button:hover,
                    .react-calendar__navigation button:focus {
                      background: #e6f3e6 !important;
                      color: #1a2f0f !important;
                      transform: translateY(-1px) !important;
                    }
                    
                    .react-calendar__navigation button:disabled {
                      background-color: transparent !important;
                      opacity: 0.5 !important;
                      cursor: not-allowed !important;
                    }
                    
                    .react-calendar__navigation__label {
                      font-size: 20px !important;
                      font-weight: 700 !important;
                      color: #2d4817 !important;
                      flex-grow: 1 !important;
                      text-align: center !important;
                    }
                    
                    .react-calendar__month-view__weekdays {
                      text-align: center !important;
                      text-transform: uppercase !important;
                      font-weight: 700 !important;
                      font-size: 0.75rem !important;
                      color: #6b7280 !important;
                      margin-bottom: 1rem !important;
                    }
                    
                    .react-calendar__month-view__weekdays__weekday {
                      padding: 0.75rem 0.25rem !important;
                      background: #f9fafb !important;
                      border-radius: 8px !important;
                      margin: 0 2px !important;
                    }
                    
                    .react-calendar__month-view__days {
                      display: grid !important;
                      grid-template-columns: repeat(7, 1fr) !important;
                      gap: 4px !important;
                    }
                    
                    .react-calendar__tile {
                      max-width: initial !important;
                      padding: 1rem 0.5rem !important;
                      background: #ffffff !important;
                      border: 2px solid #f3f4f6 !important;
                      border-radius: 12px !important;
                      font-weight: 600 !important;
                      color: #374151 !important;
                      position: relative !important;
                      transition: all 0.3s ease !important;
                      min-height: 60px !important;
                      display: flex !important;
                      flex-direction: column !important;
                      align-items: center !important;
                      justify-content: center !important;
                      cursor: pointer !important;
                    }
                    
                    .react-calendar__tile:hover {
                      background: linear-gradient(135deg, #f0fdf4 0%, #e6f3e6 100%) !important;
                      border-color: #2d4817 !important;
                      transform: translateY(-2px) !important;
                      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15) !important;
                    }
                    
                    .react-calendar__tile--active {
                      background: linear-gradient(135deg, #2d4817 0%, #2d4817 100%) !important;
                      border-color: #2d4817 !important;
                      color: white !important;
                      box-shadow: 0 4px 16px rgba(45, 72, 23, 0.3) !important;
                    }
                    
                    .react-calendar__tile--active:hover {
                      background: linear-gradient(135deg, #45a049 0%, #1a2f0f 100%) !important;
                      transform: translateY(-1px) !important;
                    }
                    
                    .react-calendar__tile--now {
                      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%) !important;
                      border-color: #f59e0b !important;
                      color: #92400e !important;
                      font-weight: 700 !important;
                    }
                    
                    .react-calendar__tile--now:hover {
                      background: linear-gradient(135deg, #fde68a 0%, #fcd34d 100%) !important;
                    }
                    
                    .react-calendar__month-view__days__day--neighboringMonth {
                      color: #d1d5db !important;
                      background: #f9fafb !important;
                    }
                    
                    .react-calendar__month-view__days__day--weekend {
                      color: #dc2626 !important;
                    }
                    
                    .dark .react-calendar__tile {
                      background: #374151 !important;
                      border-color: #4b5563 !important;
                      color: #e5e7eb !important;
                    }
                    
                    .dark .react-calendar__tile:hover {
                      background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%) !important;
                      border-color: #2d4817 !important;
                    }
                    
                    .dark .react-calendar__navigation {
                      background: linear-gradient(135deg, #374151 0%, #4b5563 100%) !important;
                    }
                    
                    .dark .react-calendar__navigation button {
                      color: #e5e7eb !important;
                    }
                    
                    .dark .react-calendar__navigation__label {
                      color: #f3f4f6 !important;
                    }
                    
                    .dark .react-calendar__month-view__weekdays__weekday {
                      background: #4b5563 !important;
                      color: #9ca3af !important;
                    }
                  `}</style>
                  
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    className="w-full"
                    tileContent={({ date, view }) => {
                      if (view === 'month') {
                        const dayEvents = upcomingRounds.filter(round =>
                          new Date(round.date).toDateString() === date.toDateString()
                        );
                        return dayEvents.length > 0 ? (
                          <div className="absolute top-1 right-1">
                            <div className="bg-gradient-to-r from-[#2d4817] to-[#2d4817] rounded-full w-3 h-3 flex items-center justify-center">
                              <div className="bg-white rounded-full w-1.5 h-1.5"></div>
                            </div>
                          </div>
                        ) : null;
                      }
                      return null;
                    }}
                    tileClassName={({ date, view }) => {
                      if (view === 'month') {
                        const hasEvents = upcomingRounds.some(round =>
                          new Date(round.date).toDateString() === date.toDateString()
                        );
                        let classes = '';
                        if (hasEvents) {
                          classes += ' event-day';
                        }
                        return classes.trim();
                      }
                      return '';
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events Section */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-8">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-[#2d4817] to-[#2d4817] p-6 rounded-t-lg">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {selectedDate ? format(new Date(selectedDate.toString()), 'MMM dd, yyyy') : 'Select a Date'}
                  </h3>
                  <p className="text-green-100 text-sm mt-1">Scheduled rounds for this date</p>
                </div>
                
                <div className="p-6 max-h-96 overflow-y-auto">
                  {selectedDate && (
                    <>
                      {upcomingRounds.filter(round =>
                        new Date(round.date).toDateString() === new Date(selectedDate.toString()).toDateString()
                      ).length > 0 ? (
                        <div className="space-y-4">
                          {upcomingRounds.filter(round =>
                            new Date(round.date).toDateString() === new Date(selectedDate.toString()).toDateString()
                          ).map((round, index) => (
                            <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl border border-green-200 dark:border-gray-500 hover:shadow-md transition-all duration-200">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1">
                                    {round.round_name}
                                  </h4>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <Clock className="h-4 w-4" />
                                    {format(new Date(`${round.date}T${round.time}`), 'p')}
                                  </div>
                                </div>
                                <div className="bg-[#2d4817] text-white px-3 py-1 rounded-full text-xs font-semibold">
                                  Round
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CalendarIcon className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 font-medium">No rounds scheduled</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">for this date</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {upcomingRounds.length === 0 && !isLoadingUpcomingRounds && (
          <div className="text-center mt-12">
            <Card className="max-w-md mx-auto shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Info className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No Upcoming Rounds</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  There are no upcoming rounds assigned to you at the moment.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      {juryTeams.length > 0 && (
        <div className="max-w-7xl mx-auto w-full mt-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900 dark:text-gray-50">
            Current Teams
          </h1>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {juryTeams.map((team) => (
              <TeamCard
                key={team.team_id}
                teamCode={team.team_id}
                teamName={team.team_representative_name}
                university={team.institution_name}
                representative={team.team_representative_name}
                speaker1={team.speaker_1_name}
                speaker2={team.speaker_2_name}
                researcher={team.researcher_name}
                opponent={pairings[team.team_id]}
              />
            ))}
          </section>
        </div>
      )}
    </main>
  )
}

export default Team
