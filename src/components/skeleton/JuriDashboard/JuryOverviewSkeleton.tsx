import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

const JuryOverviewSkeleton = () => {
    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Main Header Card Skeleton */}
            <Card className="bg-[#2d4817] text-white border-0 shadow-lg">
                <CardContent className="p-4 md:p-6">
                    {/* Top row: Welcome and Countdown */}
                    <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-6">
                        <div className="flex-1">
                            <Skeleton className="h-8 w-64 mb-3 bg-white/20" />
                            <Skeleton className="h-4 w-full mb-2 bg-white/20" />
                            <Skeleton className="h-4 w-3/4 bg-white/20" />
                        </div>

                        {/* Countdown Skeleton */}
                        <div className="bg-white rounded-lg p-3 md:p-4 w-full md:w-auto">
                            <Skeleton className="h-4 w-32 mb-2 mx-auto" />
                            <div className="bg-gray-200 rounded-md p-2 mb-2 inline-block min-w-[280px]">
                                <div className="flex justify-center gap-2">
                                    <Skeleton className="h-10 w-16" />
                                    <Skeleton className="h-10 w-16" />
                                    <Skeleton className="h-10 w-16" />
                                    <Skeleton className="h-10 w-16" />
                                </div>
                            </div>
                            <Skeleton className="h-4 w-40 mx-auto" />
                        </div>
                    </div>

                    {/* Progress Cards Section */}
                    <div className="mb-4">
                        <Skeleton className="h-6 w-48 mb-3 bg-white/20" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            {[...Array(3)].map((_, idx) => (
                                <div key={idx} className="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
                                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                                        <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded" />
                                        <Skeleton className="h-5 w-28" />
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Skeleton className="h-2 w-full rounded-full" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Chart Section Skeleton */}
            <Card className="shadow-lg border-0">
                <CardContent className="p-4 md:p-6">
                    <Skeleton className="h-6 w-48 mb-3" />
                    <div className="h-64 md:h-80 w-full">
                        <Skeleton className="h-full w-full rounded" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default JuryOverviewSkeleton
