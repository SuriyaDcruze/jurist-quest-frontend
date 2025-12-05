import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, UserCog, CheckCircle } from "lucide-react"
import useAdminOverview from "@/hooks/useAdminOverview"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
    ResponsiveContainer,
    LineChart,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
    BarChart,
    Bar
} from 'recharts'

const Overview = () => {
    const { overview, isLoading, error } = useAdminOverview()
    const navigate = useNavigate()

    useEffect(() => {
        if (error) {
            navigate("/")
        }
    }, [error, navigate])

    if (isLoading) {
        return (
            <div className="space-y-6 p-4 md:p-6">
                {/* Header Card Skeleton */}
                <Card className="bg-[#2d4817] text-white border-0 shadow-lg">
                    <CardContent className="p-4 md:p-6">
                        {/* Welcome Section Skeleton */}
                        <div className="mb-6">
                            <div className="h-8 bg-white/20 rounded animate-pulse w-64 mb-3"></div>
                            <div className="h-4 bg-white/20 rounded animate-pulse w-full mb-2"></div>
                            <div className="h-4 bg-white/20 rounded animate-pulse w-3/4"></div>
                        </div>

                        {/* Statistics Cards Skeleton */}
                        <div className="mb-4">
                            <div className="h-6 bg-white/20 rounded animate-pulse w-40 mb-3"></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                                {[...Array(4)].map((_, index) => (
                                    <div key={index} className="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
                                        <div className="flex items-center gap-2 md:gap-3 mb-2">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
                                            <div className="h-5 bg-gray-200 rounded animate-pulse w-28"></div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="h-1.5 md:h-2 w-full bg-gray-200 rounded-full animate-pulse"></div>
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Charts Section Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart 1 Skeleton */}
                    <Card className="shadow-lg border-0">
                        <CardContent className="p-4 md:p-6">
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-3"></div>
                            <div className="h-64 md:h-80 bg-gray-100 rounded animate-pulse"></div>
                        </CardContent>
                    </Card>

                    {/* Chart 2 Skeleton */}
                    <Card className="shadow-lg border-0">
                        <CardContent className="p-4 md:p-6">
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-3"></div>
                            <div className="h-64 md:h-80 bg-gray-100 rounded animate-pulse"></div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    const statsData = [
        { name: 'Total Teams', value: overview.total_teams },
        { name: 'Active Teams', value: overview.active_teams },
        { name: 'Total Juries', value: overview.total_juries },
        { name: 'Active Juries', value: overview.active_juries },
    ]

    const roundsData = Object.entries(overview.teams_by_round).map(([round, count]) => ({
        round,
        teams: count
    }))

    return (
        <div className="space-y-6 p-4 md:p-6">
            <Card className="bg-[#2d4817] text-white border-0 shadow-lg">
                <CardContent className="p-4 md:p-6">
                    {/* Welcome Section */}
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Admin Dashboard</h1>
                        <p className="text-green-100 mb-4 md:mb-6 text-sm md:text-base">
                            Welcome to the JuristQuest 2025 Admin Panel. Manage teams, juries, and monitor competition progress.
                        </p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="mb-4">
                        <h3 className="text-base md:text-lg font-semibold mb-3 text-white">System Overview</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            {/* Total Teams */}
                            <div className="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
                                <div className="flex items-center gap-2 md:gap-3 mb-2">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#2d4817] rounded flex items-center justify-center flex-shrink-0">
                                        <Users className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-base md:text-lg font-bold text-gray-900">Total Teams</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="h-1.5 md:h-2 w-full bg-gray-200 rounded-full">
                                        <div className="h-full w-[100%] bg-[#2d4817] rounded-full"></div>
                                    </div>
                                    <div className="text-xs text-gray-500 whitespace-nowrap">{overview.total_teams}</div>
                                </div>
                            </div>

                            {/* Active Teams */}
                            <div className="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
                                <div className="flex items-center gap-2 md:gap-3 mb-2">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#2d4817] rounded flex items-center justify-center flex-shrink-0">
                                        <UserCheck className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-base md:text-lg font-bold text-gray-900">Active Teams</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="h-1.5 md:h-2 w-full bg-gray-200 rounded-full">
                                        <div
                                            className="h-full bg-[#2d4817] rounded-full"
                                            style={{ width: `${overview.total_teams > 0 ? (overview.active_teams / overview.total_teams) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-gray-500 whitespace-nowrap">{overview.active_teams}</div>
                                </div>
                            </div>

                            {/* Total Juries */}
                            <div className="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
                                <div className="flex items-center gap-2 md:gap-3 mb-2">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#2d4817] rounded flex items-center justify-center flex-shrink-0">
                                        <UserCog className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-base md:text-lg font-bold text-gray-900">Total Juries</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="h-1.5 md:h-2 w-full bg-gray-200 rounded-full">
                                        <div className="h-full w-[100%] bg-[#2d4817] rounded-full"></div>
                                    </div>
                                    <div className="text-xs text-gray-500 whitespace-nowrap">{overview.total_juries}</div>
                                </div>
                            </div>

                            {/* Active Juries */}
                            <div className="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
                                <div className="flex items-center gap-2 md:gap-3 mb-2">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#2d4817] rounded flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-base md:text-lg font-bold text-gray-900">Active Juries</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="h-1.5 md:h-2 w-full bg-gray-200 rounded-full">
                                        <div
                                            className="h-full bg-[#2d4817] rounded-full"
                                            style={{ width: `${overview.total_juries > 0 ? (overview.active_juries / overview.total_juries) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-gray-500 whitespace-nowrap">{overview.active_juries}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Overview Statistics Chart */}
                <Card className="shadow-lg border-0">
                    <CardContent className="p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-semibold mb-3 text-gray-900">Overview Statistics</h3>
                        <div className="h-64 md:h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={statsData}
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
                                        angle={-15}
                                        textAnchor="end"
                                        height={60}
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

                {/* Teams by Round Chart */}
                <Card className="shadow-lg border-0">
                    <CardContent className="p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-semibold mb-3 text-gray-900">Teams by Round</h3>
                        <div className="h-64 md:h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={roundsData}
                                    margin={{
                                        top: 5,
                                        right: 15,
                                        left: 0,
                                        bottom: 5,
                                    }}
                                >
                                    <XAxis
                                        dataKey="round"
                                        tick={{ fontSize: 12 }}
                                        angle={-15}
                                        textAnchor="end"
                                        height={60}
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
                                    <Bar
                                        dataKey="teams"
                                        fill="#2d4817"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Overview
